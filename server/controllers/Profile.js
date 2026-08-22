//const { findOne } = require("../models/OTP");
const CourseProgress = require("../models/CourseProgress");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const { findById } = require("../models/Section");
const User = require("../models/User");
const { uploadImageToCloudinary }  = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration");

exports.updateProfile = async(req,res) => {
    try{
        // fetch data , get userId
        const {about="" , dateOfBirth="" , contactNumber}  = req.body;

        // get userId
        const id = req.user.id;

        // validate
        if(!contactNumber || !id) 
        {
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // const userDetails = await User.findById(id);
        // const profile = await Profile.findById(userDetails.additionalDetails);

        // update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        await profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"unable to update profile , please try again",
            error:error.message,
        });
    }
}

exports.deleteProfile = async(req,res) => {
    try{
        // get id
        const id = req.user.id;

        // validation
        const userDetails = await findById(id);
        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:"user not found",
            });
        }

        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // delete user
        await User.findByIdAndDelete({_id:id});

        // unEnrolled user from all Enrolled user
        // return response
        return res.status(200).json({
            success:true,
            message:"user deleted successfully",
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"unable to delete profile , please try again",
            error:error.message,
        });
    }
}

exports.getAllUserDetails = async(req,res) => {
    try{
        // get id 
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        console.log(userDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"user data fetch successfully",
            data : userDetails,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}

// know this
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async(req,res) => {
    try {
        console.log("req.user =", req.user);
        // fetch data
        const userId = req.user.id;

        let userDetails = await User.findOne({_id : userId,
        })
        .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
        .exec()

        // parseInt(curr.timeDuration)
        // Number(curr.timeDuration || 0)
         // course progress count 
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds
            )
            SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length
        }
        let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
        })
        courseProgressCount = courseProgressCount?.completedVideos.length || 0
        if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
        } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
            Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
        }
        console.log("userDetails =", userDetails);

        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:`could not find user with id ${userDetails}`,
            });
        }

        // return response
        return res.status(200).json({
            success:true,
            message:"courses data fetch successfully",
            data : userDetails.courses,
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }

}

exports.instructorDashboard = async(req,res) => {
  try{
    const {user} = req.user.id
    // const {user} = req.body
    console.log("instructor user is ", user)
    //console.log("instructor user2 is ", user2)
    const courseDetails = await Course.find({instructor : req.user.id})
    const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price

        // Create a new object with the additional fields
      const courseDataWithStats = {
        _id : course._id,
        courseName : course.courseName,
        courseDescription : course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats;
    })

    res.status(200).json({courses:courseData}) 
  }
  catch(error)
    {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}
/*
    how to schedule any time for delete account in business logic

    // cron job
    // Cron jobs are beneficial for automating tasks in web applications, 
    // server-side applications, and other Node.js projects.
    // that run automatically at specific intervals
    
    // how can we schedule delete account 
*/