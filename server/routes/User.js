const express = require("express");
const router = express.Router();

const {signUp,login,sendOTP,changePassword} = require("../controllers/Auth");
const {auth} = require("../middlewares/auth");
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword");

router.post("/login",login);
router.post("/signup",signUp);

// Route for sending OTP to the user's email
router.post("/sendotp", sendOTP)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

module.exports = router;

// // testing protected routes for single middleware
// router.get("/test" , auth , (req,res) => {
//     res.json({
//         success: true,
//         message:'welcome to protected route for testing',
//     });
// });

// // protected routes
// // path , middleware , handler
// router.get("/student" , auth , isStudent , (req,res) => {
//     res.json({
//         success: true,
//         message:'welcome to protected route for students',
//     });
// });

// router.get("/admin" , auth , isAdmin , (req,res) => {
//     res.json({
//         success: true,
//         message:'welcome to protected route for admin',
//     });
// });

// router.get("/instructor" , auth , isInstructor , (req,res) => {
//     res.json({
//         success : true,
//         message : 'welcome to protected route for instructor',
//     });
// });

/*
//http://localhost:4000/api/v1/auth
//http://localhost:4000/api/v1/profile
//http://localhost:4000/api/v1/course
*/