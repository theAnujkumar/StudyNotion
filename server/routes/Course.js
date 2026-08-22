const express = require("express");
const router = express.Router();

//import controller
const {createCourse,getAllCourses,getCourseDetails, editCourse, getInstructorCourses, deleteCourse, getFullCourseDetails} = require("../controllers/Course");
const {createCategory,showAllCategories,categoryPageDetails} = require("../controllers/Category");
//const {capturePayment,verifySignature} = require("../controllers/Payments");
const {createRating,getAllRating,getAverageRating, getAllRatingReview} = require("../controllers/RatingAndReview")
const {createSection,updateSection,deleteSection} = require("../controllers/Section");
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/Subsection");
const {updateProfile,deleteProfile,updateDisplayPicture,getAllUserDetails} = require("../controllers/Profile");
const {updateCourseProgress} = require("../controllers/CourseProgress")

// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

//define api route
// path ko map karvana with controller

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
// delete couurse
router.delete("/deleteCourse",auth,isInstructor,deleteCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Get full Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)

module.exports = router;

