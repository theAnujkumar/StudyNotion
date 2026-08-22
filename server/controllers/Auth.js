const OTP = require("../models/OTP");
const User = require("../models/User");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// send otp
exports.sendOTP = async(req,res) => {
    try{
        
    // fetch email from request ki body
    const {email} = req.body;

    // check user exist or not
    const checkUserPresent = await User.findOne({email});

    // if user already exist then return response
    if(checkUserPresent) {
        return res.status(401).json({
            success : false,
            message : "user already registered",
        })
    }

    // generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars : false
    });
    console.log("otp generated : ", otp);

    // check unique otp or not
    const result = await OTP.findOne({otp: otp});
    console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

    while(result)
    {
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false
        });
        //result = await OTP.findOne({otp: otp});
    }

    const otpPayload = {email,otp};

    /// create entry into db
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP body",otpBody);

    // return successfully response
    res.status(200).json({
        success:true,
        message: "otp sent successfully",
        otp,
    })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}
 
// signup
exports.signUp = async(req,res) => {
    try{
        // fetch data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body; 

        // validation 
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp)
        {
            return res.status(403).json({
                success:false,
                message : "please fill all the details",
            })
        }

        // 2 password matching
        if(password !== confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message : "password do not match with confirm password,please try again",
            })
        }
        // check if user exist
        const existingUser = await User.findOne({email});
        if(existingUser)
        {
            return res.status(400).json({
                success:false,
                message : "user is already registered",
            })
        }
        
        // find most recent otp stored for email
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        // may be there will be changes
        // validate otp
        if(recentOtp.length == 0)
        {
            return res.status(400).json({
                success:false,
                message : "otp is not valid",
            })
        }
        else if(otp != recentOtp[0].otp) {
            // invalid otp
            return res.status(400).json({
                success:false,
                message : "invalid otp",
            })
        }

        // password hash
        const hasedPassword = await bcrypt.hash(password,10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

		// Create the Additional Profile For User
        // create entry into db

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })
        const user = await User.create({
            firstName,
            lastName,
            password : hasedPassword,
            email,
            contactNumber,
            accountType : accountType,
            approved : approved,
            // profiledetails ki object id pass karne hai
            additionalDetails : profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        // image pending ? 

    // return successfully response
    res.status(200).json({
        success:true,
        message: "user is registered successfully",
        user,
    })

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "user cannnot be registered . please try again",
        })
    }
}

// Login controller for authenticating users
exports.login = async (req,res) => {
    try{
        // get data from req body
        const {email,password} = req.body;

        // validation data
        if(!email || !password)
        {
            return res.status(403).json({
                success:false,
                message: "all fields are required . please fill",
            });
        }

        // user check exist or not 
        const user = await User.findOne({email}).populate("additionalDetails");


        // populate is use to send actual data not object id of additional details
        // we get all details 
        //  helps replace ObjectIds with the actual data from related collections.


        if(!user)
        {
            return res.status(401).json({
                success:false,
                message: "user is not registered ,please signup first",
            });
        }

        // validation password and then generate jwt token
        // if(await bcrypt.compare(password,confirmPassword)) {
        //     const payload = {
        //         email : user.email,
        //         id : user._id,
        //         accountType : user.accountType,
        //     }
        //     const token = jwt.sign(payload,process.env.JWT_SECRET,{
        //         expiresIn : "2h",
        //     });

        if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ email: user.email, id: user._id,
                    accountType: user.accountType},
                //{ email: user.email, id: user._id, role: user.role },
				process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
			);

			// Save token to user document in database
            user.token = token;
            user.password = undefined;

            // create cookie and return response
        const options = {
            expires : new Date(Date.now() + 3*24*60*60*1000),
            httpOnly : true,
        }
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message : "login successfully",
        })

        }

        else {
            return res.status(401).json({
                success:false,
                message: "password is incorrect",
            });
        }
        
    }

    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "login failure . please try again",
        })
    }
};


// changePassword
exports.changePassword = async(req,res) => {
    try{
        // get user details
        const userDetails = await User.findById(req.user.id);

    // get oldpassword,newPassword,newconfirmPassword
    const {oldPassword , newPassword , newconfirmPassword} = req.body;

    // validate old password
    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password,
    )

    if(!isPasswordMatch)
    {
        // if old password does not match return res
        return res.status(401).json({
            success : false,
            message : "incorrect password",
        })
    }

    // validation
    if(newPassword !== newconfirmPassword)
    {
        return res.status(403).json({
                success:false,
                message: "the password and confirm password do not match",
            });
    }

    // update password
    const encryptedPassword = await bcrypt.hash(newPassword,10);
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        {password : encryptedPassword},
        {new : true},
    );

    // send notification mail
    try{
        const emailResponse = await mailSender(
            updatedUserDetails.email,
            passwordUpdate(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );
        console.log("email sent successfully" , emailResponse.response);
    }  
    catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

    return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
    }

    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "unable to change password. please try again",
            error : error.message,
        });
    }
}


/*
.sort({ createdAt: -1 }): 
Sorts those results by the createdAt field 
in descending order (so the newest document comes first).

.limit(1): Limits the result to only one document,
 i.e., the most recent one due to the sorting.
*/

// populate
//Now it's the full User document, e.g. { _id, name, email, ... } instead of object