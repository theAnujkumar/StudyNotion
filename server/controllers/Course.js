const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const messageFomatter = require("../utils/formMessageAdder")
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");

// createCourse handler function
exports.createCourse = async(req,res) => {
    try{

        // check for instructor from token
        const userId = req.user.id;

        // fetch data
        let {courseName , courseDescription ,whatYouWillLearn , price , category ,
           tag: _tag , status , instructions: _instructions} = req.body;

            // console.log("req body",req.body);
            // console.log("req user id",req.user.id);
            // console.log("courseTitle",courseName);
            // console.log("courseShortDesc",courseDescription)
            // console.log("coursePrice",price)
            // console.log("courseBenefits",whatYouWillLearn)
            // console.log("courseCategory",category)
            // console.log("courseRequirements",instructions)

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)

        console.log("tag", tag)
        console.log("instructions", instructions)
        
        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category 
             || !thumbnail || !tag.length || !instructions.length
        ){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        let mandatoryMessage = "Kindly Fill ";
        const requiredField = messageFomatter({courseName,
        courseDescription,
        whatYouWillLearn,  
        price, 
        category});
        console.log(requiredField);
        if( requiredField != ""){
            return res.status(400).json({
                success:false,
                message:mandatoryMessage + requiredField,
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}
		// Check if the user is an instructor
		const instructorDetails = await User.findById(userId, {
			accountType: "Instructor",
		});
        //console.log("instructor details = " ,instructorDetails);

        if(!instructorDetails)
        {
            return res.status(404).json({
                success:false,
                message:"instructor details not found",
            });
        }

        // check given category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails)
            {
                return res.status(404).json({
                    success:false,
                    message:"category details not found",
                });
            }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        console.log("thumbnail image" , thumbnailImage);

        // create entry into db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn : whatYouWillLearn,
            price,
            tag,
            category : categoryDetails._id,
            thumbnail : thumbnailImage.secure_url,
            status : status,
            instructions,
        })

        // add new course to user schema of instructor
        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push : {
                    courses : newCourse._id,
                }
            },
            {new:true},
        );

        // update category ka schema
        // add new course to category
        const categoryDetails2 = await Category.findByIdAndUpdate(
            //{_id : instructorDetails._id},
            {_id : category},
            {
                $push : {
                    //course : newCourse._id,
                    courses : newCourse._id,
                }
            },
            {new:true},
        )

        //console.log("HEREEEEEEEE", categoryDetails2)
        
        // return response
        return res.status(200).json({
            success:true,
            message:"course created successfully",
            data : newCourse,
        });
    }


    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course successfully",
        });
    }
}


// getAllCourses handler function
exports.getAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({} , {
            courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,
        })
        .populate("instructor")
        // check yes or no
        .exec();

        return res.status(200).json({
            success:true,
            message:"data for all courses fetch successfully",
            data:allCourses,
        });
    }

    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
        });
    }
}


// // getAllCourses details

exports.getCourseDetails = async(req,res) => {
    try{
        // fetch id
        const {courseId} = req.body;

        // find all course details
        const courseDetails = await Course.findOne({_id:courseId})
                                            .populate(
                                                {
                                                    path:"instructor",
                                                    populate:{
                                                        path:"additionalDetails"
                                                    }
                                                }
                                            )
                                            .populate("category")
                                            .populate("ratingAndReviews")
                                            .populate(
                                                {
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection",
                                                    },
                                                }
                                            )
                                            .exec();
        //console.log("get course details of backend : ",courseDetails)
        if(!courseDetails)
        {
            return res.status(400).json({
                    success:false,
                    message:`could not find the course with ${courseId}`,
                });
        }

        // let totalDurationInSeconds = 0
        // courseDetails.courseContent.forEach((content) => {
        //     content.subSection.forEach((subSection) => {
        //         const timeDurationInSeconds = parseInt(subSection.timeDuration)
        //         totalDurationInSeconds += timeDurationInSeconds
        //     })
        // })

        // const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        const totalDuration = 10
        // return response
        return res.status(200).json({
            success:true,
            message:"all course details fetch successfully",
            data : {
                courseDetails,
                totalDuration,
            },
        });
    }

    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch course data",
        });
    }
}


// edit course
exports.editCourse = async (req, res) => {
  try {
    console.log("req ke body in edit course",req.body);
    const { courseId } = req.body
    console.log("course id req ke body",courseId)
    const updates = req.body
    const course = await Course.findById(courseId)
    console.log("course of edit course",course);

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    // for (const key in updates) {
    //   if (updates.hasOwnProperty(key)) {
    //     if (key === "tag" || key === "instructions") {
    //       course[key] = JSON.parse(updates[key])
    //     } else {
    //       course[key] = updates[key]
    //     }
    //   }
    // }
    for (const key in updates) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
        if (key === "tag" || key === "instructions") {
        course[key] = JSON.parse(updates[key])
        } else {
        course[key] = updates[key]
        }
    }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// delete course
// get instructor courses
exports.getInstructorCourses = async(req,res) => {
  try{

    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
        instructor : instructorId,
    }).sort({createdAt : -1})

    // Return the instructor's courses
    res.status(200).json({
        success:true,
        data :instructorCourses
    })
  }
  catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

exports.deleteCourse = async(req,res) => {
  try{
    const {courseId} = req.body
    console.log("courseId of deleted course" ,courseId)

    // find course of this id
    const course = await Course.findById(courseId);
    console.log("course of deleted course" ,course)

    if(!course)
    {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnroll = course.studentsEnrolled || []
    for (const studentId of studentsEnroll) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    
    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
    } 
    catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }

}

exports.getFullCourseDetails = async(req,res) => {
  try{
    const {courseId} = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
        _id : courseId,
    })
    .populate({
        path : "instructor",
        populate : {
            path : "additionalDetails"
        },
    })
    .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

      let courseProgressCount = await CourseProgress.findOne({
        courseID : courseId,
        userId : userId,
      })

      console.log("courseProgressCount : ", courseProgressCount)

        if (!courseDetails) {
        return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
        })
        }

        let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  }
  catch(error)
  {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
  
}
// get all courses
// get full coursedetails
// delete course 
// delete all courses at once