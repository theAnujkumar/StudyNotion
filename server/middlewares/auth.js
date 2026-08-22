const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// authentication
// exports.auth = async (req, res, next) => {
//     try{
//         console.log("HEADERS:", req.headers);
//         //extract token
//         console.log("BEFORE ToKEN EXTRACTION");

//         // const token = req.cookies.token 
//         //                 || req.body.token 
//         //                 || req.headers.authorization?.split(" ")[1];

//         const token = req.cookies.token 
//                         || req.body.token 
//                         || req.header("Authorization").replace("Bearer ", "");

//         //const authHeader = req.header("Authorization");
//         // const token = req.cookies.token 
//         //             || req.body.token 
//         //             || (authHeader && authHeader.startsWith("Bearer ")
//         //                 ? authHeader.replace("Bearer ", "")
//         //                 : null);

//         console.log("TOKEN",token);
//         console.log("AFTER ToKEN EXTRACTION");

//         //if token missing, then return response
//         if(!token) {
//             return res.status(401).json({
//                 success:false,
//                 message:'Token is missing',
//             });
//         }

//         //verify the token
//         try{
//             const decode = jwt.verify(token, process.env.JWT_SECRET);
//             console.log(decode);
//             req.user = decode;
//         }
//         catch(err) {
//             //verification - issue
//             return res.status(401).json({
//                 success:false,
//                 message:'token is invalid',
//             });
//         }
//         next();
//     }
//     catch(error) {  
//         return res.status(401).json({
//             success:false,
//             message:'Something went wrong while validating the token',
//         });
//     }
// }

exports.auth = async (req, res, next) => {
    try {

        console.log("HEADERS:", req.headers);

        const token =
            req.cookies?.token ||
            req.body?.token ||
            req.header("Authorization").replace("Bearer ", "");
            //req.headers.Authorization?.split(" ")[1];

        console.log("Extracted Token:", token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded:", decoded);
            req.user = decoded;
        } 
        catch (err) {
            console.log("JWT VERIFY ERROR:", err.message);
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        next();

    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }
};

// authorization
// isStudent
exports.isStudent = async (req,res,next) => {
    try{
        if(req.user.accountType !== "Student")
        {
            return res.status(401).json({
                success : false,
                message : "this is protected route for student only",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "user role cannot be verified",
        })
    }
}

// isadmin
exports.isAdmin = async(req,res,next) => {
    try{
        console.log("printing account type" , req.user.accountType);
        if(req.user.accountType !== "Admin")
        {
            return res.status(401).json({
                success : false,
                message : "this is protected route for admin only",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "user role cannot be verified",
        })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        console.log("Decoded User:", req.user);
        console.log("User accountType:", req.user.accountType);
        if(req.user.accountType !== "Instructor")
        {
            return res.status(401).json({
                success : false,
                message : "this is protected route for Instructor only",
            })
        }
        next();
    }
    catch(error)
    {
        return res.status(500).json({
            success : false,
            message : "user role cannot be verified",
        })
    }
}

// go to protected route