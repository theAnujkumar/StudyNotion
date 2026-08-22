// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// const User = require("./models/User");
// const {signup,login} = require("../controllers/Auth");
// const {auth,isAdmin,isStudent} = require("../middlewares/auth")
// const mongoose = require("mongoose");
// const router = require("./routes/User");
// const OTP = require("../models/OTP");
// const User = require("../models/User");
// const otpGenerator = require("otp-generator");
// const bcrypt = require("bcrypt");
// const mailSender = require("../utils/mailSender");
// require("dotenv").config();


// exports.changePassword = async(req,res) => {
//     try{
//         const userDetails = await User.findById(req.user.id);
//         const {oldPassword , newPassword , newconfirmPassword} = req.body;

//         const isPasswordMatch = await bcrypt.compare(
//             oldPassword,
//             userDetails.password
//         )
//         if(!isPasswordMatch)
//         {

//         }
//         if(newPassword !== newconfirmPassword)
//         {

//         }
//         const encryptedPassword = await bcrypt.hash(newPassword,10);
//         const updatedUserDetails = await User.findByIdAndUpdate(req.user.id,
//             {password : encryptedPassword},
//             {new:true}
//         )
//     }
//     catch(error)
//     {

//     }
// }
// exports.sendOtp = async(req,res) => {

//     try{
//         const {email} = req.body;
//     const checkUserPresent = await User.find({email});

//     if(!checkUserPresent)
//     {

//     }

//     var otp = otpGenerator.generate(6,{
//         upperCaseAlphabets:false
//     })

//     const result = await OTP.findOne({otp:otp});

//     while(result)
//     {
//         var otp = otpGenerator.generate(6,{
//         upperCaseAlphabets:false
//         })
//         const result = await OTP.findOne({otp:otp});
//     }

//     const otpPayload = {email,otp};
//     const otpbody = await OTP.create(otpPayload);

//     }
//     catch(error)
//     {

//     }
// }

// exports.signUp = async(req,res) => {
//     try{
//         const {firstName,lastName,email,password,confirmPassword,otp} = req.body;
//         if(!firstName || !lastName || !email || !password || !confirmPassword || !otp)
//         {
//             return res.status(400).json({
//                 success:false
//             })
//         }
//         if(password != confirmPassword)
//         {
//             return res.status(400).json({
//                 success:false
//             })
//         }
//         const existingUser = await User.findOne({email});
//         if(existingUser)
//         {
//             return res.status(400).json({
//                 success:false
//             })
//         }
//         const recentOtp = await User.find({email}.sort({createdAt:-1})).limit(1);
//         if(recentOtp.length == 0)
//         {

//         }
//         else if(otp != recentOtp)
//         {

//         }
//         const hasedPassword = await bcrypt.hash(password,10);

//         let approved = "";
//         approved === "Instructor" ? (approved = false) : (approved = true);


//     }
//     catch(error)
//     {

//     }
// }

// exports.login = async(req,res)=> {
//     try{
//         const {email,password} = req.body;

//         if(!email || !password)
//         {

//         }
//         const user = await User.findOne({email}).populate("additionalDetails");
//         if(!user)
//         {

//         }

//         if(await bcrypt.compare(password,user.password)){
//             const token = jwt.sign(
//                 {email : user.email , id : user._id , role : user.role},
//                 process.env.JWT_SECRET,
//                 {expiresIn : "2h"}
//             );

//             user.token = token;
//             user.password = undefined;

//             const options = {
//             expires : new Date(Date.now() + 3*24*60*60*1000),
//             httpOnly : true,
//         }
//             res.cookie("token",token,options).status(200).json({
//                 success : true,
//                 token,
//                 user
//             })
//         }

//     }
//     catch(error)
//     {

//     }

// }

// router.post("/signup",signup);
// router.post("/login",login);

// router.get("/test",auth,(req,res)=> {
//     res.json({
//         success : true,
//         message : "welcome to protected route"
//     })
// })

// const userSchema = new mongoose.Schema({
//     firstName : {
//         type : String,
//         required : true,
//         trim : true,
//     },

//     courses : [{
//         type : mongoose.Schema.Types.ObjectId,
//         ref : "Course",
//     }]
// })

// module.exports = mongoose.model("User",userSchema);




// exports.auth = async(req,res) => {
//     try{
//         const token = req.body.token;

//         if(!token)
//         {
//             return res.status(401).json({
//                 success : false,
//                 message : "token missing"
//             })
//         }

//         try{
//             const decode = jwt.verify(token,process.env.JWT_SECRET);
//             req.user=decode;
//         }
//         catch(error)
//         {

//         }
//     }
//     catch(error)
//     {

//     }
// }

// exports.isStudent = async(req,res) => {
//     try{
//         if (req.user.accountType !== "Student")
//         {
//             return res.status(401).json({

//             })
//         }
//         next();
//     }
//     catch(error)
//     {

//     }
// }

// exports.isAdmin = async(req,res) => {
//     try{
//         if(req.user.accountType !== "Admin")
//         {
//             return res.status(401).json({

//             })
//         }
//     }
//     catch(error)
//     {

//     }
// }


/*
                React Router me useParams() URL ke parameters ko access karne ke liye use hota hai.

const { courseId } = useParams();

iska matlab hai:

useParams() ek object return karta hai jisme URL ke parameters hote hain.
Object destructuring ki help se courseId parameter nikal rahe hain.
Example

Agar route hai:

<Route path="/courses/:courseId" element={<CourseDetails />} />

Aur browser URL hai:

/courses/123

To

const params = useParams();
console.log(params);

Output:

{
  courseId: "123"
}

Destructuring use karne par:

const { courseId } = useParams();

console.log(courseId);

Output:

123

                                data._id kya hai?

data object ka _id property access kar raha hai.

data._id

Matlab:

{
  _id: "sec2",
  sectionName: "React Basics"
}

se

data._id   // "sec2"

*/

// // // create app instance
// // const express = require("express");
// // const app = express();

// // // load dotenv file into config
// // require("dotenv").config();
// // const PORT = process.env.PORT || 4000;

// // // add middleware
// // app.use(express.json());

// // // import routes
// // const server = require("./routes/server");

// // // mount api routes
// // app.use("/api/v1",server);

// // // connect to db and database
// // const db = require('./config/database');
// // db.connect();

// // // 

// // app.listen(PORT , () => {
// //     console.log(`prt is ${PORT}`)
// // })


/*

Best Practice

Agar API se data fetch kar rahe ho, to loading aur empty state alag rakhna behtar hai:

const [courses, setCourses] = useState([]);
const [loading, setLoading] = useState(true);

Render:

if (loading) {
  return <Spinner />;
}

if (courses.length === 0) {
  return <p>No Courses Found</p>;
}

return (
  <>
    {courses.map((course) => (
      <p key={course._id}>{course.courseName}</p>
    ))}
  </>
);

*/

