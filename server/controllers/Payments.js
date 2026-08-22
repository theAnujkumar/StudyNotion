const mongoose = require("mongoose")
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");


// capture the payment and initaite razorpay order
exports.capturePayment = async(req,res) => {
  const {courses} = req.body;
  const userId = req.body.id; 

  if (courses.length === 0) {
    return res.json({ success: false, message: "Please Provide Course ID" })
  }

  let total_amount = 0
  for(const course_id of courses)
  {
    let course
    try{
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

    // Check if the user is already enrolled in the course
    const uid = new mongoose.Types.ObjectId(userId)
    if(course.studentsEnrolled.includes(uid))
    {
      return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
    }

    // Add the price of the course to the total amount
    total_amount += course.price
    }

    catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  // create a options
  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  }

  console.log("RAZORPAY_KEY =", process.env.RAZORPAY_KEY);
  console.log("RAZORPAY_SECRET =", process.env.RAZORPAY_SECRET);

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    console.log(paymentResponse)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } 
  catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// exports.capturePayment = async(req,res) => {

//     // get courseId and userId
//     const {course_id} = req.body;
//     const userId = req.user.id;

//     // validation
//     // validate course id
//     if(!userId)
//     {
//         return res.json({
//             success:false,
//             message : "please provide valid user id",
//         })
//     }

//     // validate course details
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course)
//         {
//             return res.json({
//                 success:false,
//                 message : "could not find course",
//             })
//         }

//         // user already pay for samecourse
//         // convert string format user id into object id
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentEnrolled.includes(uid))
//         {
//         return res.status(400).json({
//             success:false,
//             message : "student already enrolled",
//         })
//         }

//     }
//     catch(error)
//     {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"cannot fetch course data",
//         });
//     }


//     // create order 
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount : amount * 100,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes : {
//             courseId : course_id,
//             userId,
//         }
//     };

//     try{
//         // initailize payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName : course.courseName,
//             courseDescription : course.courseDescription,
//             thumbnail : course.thumbnail,
//             orderId : paymentResponse.orderId,
//             currency: paymentResponse.currency,
//             amount : paymentResponse.amount,
//         }); 
//     }
//     catch(error)
//     {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"cannot fetch course data",
//         });
//     }
// };


// verify the payment
exports.verifyPayment = async(req,res) => {

  console.log("req.user =", req.user);
  console.log("req.user =", req.user.id);
  console.log("headers =", req.headers);

  const razorpay_order_id = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature = req.body?.razorpay_signature
  const courses = req.body?.courses

  const userId = req.user.id

    if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed all field required" })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses,userId,res)
    return res.status(200).json({ success: true, message: "Payment Verified" })
  }
  console.log("payment failed in verify payment")
  return res.status(200).json({ success: false, message: "Payment Failed" })
}

// verify signature of razorpay and server 
// exports.verifySignature = async(req,res) => {

//     const webhookSecret = "12345678";
//     const signature = req.headers["x-razorpay-signature"];

//     const shasum = crypto.createHmac("sha256",webhookSecret);

//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest)
//     {
//         console.log("payment is authorized");

//         const {courseId , userId} = req.body.payload.payment.entity.notes;

//         try{
//             // fulfil the action

//             // find course and enroll the student in it
//             const enrolledCourse = await Course.findByIdAndUpdate(
//                                         {_id : courseId},
//                                         { $push : {studentEnrolled:userId}},
//                                         {new : true},
//             );

//             if(!enrolledCourse)
//             {
//                 return res.status(400).json({
//                 success:false,
//                 message : "course not found",
//             })
//             }

//             console.log(enrolledCourse);

//             // find the student and add course to their list enrolled courses me
//             const enrolledStudent = await User.findByIdAndUpdate(
//                                         {_id: userId},
//                                         {$push : {courses : courseId}},
//                                         {new : true},
//             );

//             console.log(enrolledStudent);

//             // confirmation vale mail send karne 
//             const emailResponse = await mailSender(
//                                     enrolledStudent.email,
//                                     "congratulations from codehelp",
//                                     "congratulations , you are unboarded into codeHelp course",
//             );

//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message : "signature verified and course added",
//             })

//         }

//         catch(error)
//         {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//         }
//     }

//     else{
//         return res.status(400).json({
//                 success:false,
//                 message : "invalid request",
//         })
//     }
// }

// enroll the student in the courses
const enrollStudents = async(courses,userId,req) =>
{
 if(!courses || !userId)
 {
   return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
 }
 for(const courseId of courses)
 {
   try{
    // Find the course and enroll the student in it
    const enrolledCourse = await Course.findByIdAndUpdate(
      {_id : courseId},
      { $push : {studentsEnrolled:userId}},
      {new : true}
    )

    if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
    //console.log("Updated course: ", enrolledCourse)

    // course progress pending
    const courseProgress = await CourseProgress.create({
      courseID: courseId,
      userId: userId,
      completedVideos: [],
    })

    // Find the student and add the course to their list of enrolled courses
    const enrolledStudent = await User.findByIdAndUpdate(
      //{_id : userId},
      userId,
      {$push : {courses:courseId , courseProgress:courseProgress._id}},
      { new: true }
    )
    //console.log("Enrolled student: ", enrolledStudent)

    // Send an email notification to the enrolled student
    const emailResponse = await mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      )
    )
    //console.log("Email sent successfully: ", emailResponse.response)
   }
   catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
 }
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const {orderId , paymentId , amount } = req.body;
  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try{
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  }

  catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}