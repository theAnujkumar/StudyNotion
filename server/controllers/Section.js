const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");
//const SubSection = require("../models/Subsection")
//const { default: SubSectionModal } = require("../../src/components/core/Dashboard/AddCourse/CourseBuilder/SubSectionModal");


// create section
exports.createSection = async(req,res) => {
    try{
        // fetch data
        const {sectionName,courseId} = req.body;

        // validate
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"missing properties",
            });
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section objId
        const updateCourseDetails = await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push : {
                                                    courseContent : newSection._id,
                                                }
                                            },
                                            {new : true},
        )
                                .populate(
                                    {
                                        path : "courseContent",
                                        populate : {
                                            path : "subSection",
                                        }
                                    }
                                )
                                .exec();

        // .populate("likes") ne Like ke ObjectId ko replace karke 
        // poora Like object return kar diya
        
        // how to populate section and subsection both ?
        // use populate to replace section and subsection both in updateCourseDetails

        // return response
        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updateCourseDetails,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"unable to create section , please try again",
            error:error.message,
        });
    }
}



// update section
exports.updateSection = async(req,res) => {
    try{
        // fetch input data
        const {sectionName , sectionId , courseId} = req.body;

        // validate
        if(!sectionName || !sectionId || !courseId)
            {
                return res.status(400).json({
                    success:false,
                    message:"missing properties",
                });
            }

        // update data in section
        const section = await Section.findByIdAndUpdate(sectionId , {sectionName} , {new:true})

        // updated course
        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
        .exec()
        console.log(course)
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
            message:section,
            data : course,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"unable to update section , please try again",
            error:error.message,
        });
    }
}


//delete section
// exports.deleteSection = async(req,res) => {
//     try{
//         // get id -> assuming that we are sending id in params
//         const {sectionId} = req.body;

//         // find by id and delete 
//         await Section.findByIdAndDelete(sectionId);

//         // TODO :- do we need to delete the entry from course schema ?
//         //await Course.findByIdAndDelete();

//         // return response
//         return res.status(200).json({
//             success:true,
//             message:"section deleted successfully",
//         });
//     }

//     catch(error)
//     {
//         return res.status(500).json({
//             success:false,
//             message:"unable to delete section , please try again",
//             error:error.message,
//         });
//     }
// }

exports.deleteSection = async(req,res) => {
    try{
    const {sectionId,courseId} = req.body;

    await Course.findByIdAndUpdate(courseId,{
        $pull :{
            courseContent : sectionId,
        }
    })

    const section = await Section.findById(sectionId);
    console.log(sectionId,courseId);
    if(!section)
    {
        return res.status(404).json({
            success:false,
            message:"section not found",
            error:error.message,
        });
    }

    // delete subSection
    await SubSection.deleteMany({_id : {$in:section.subSection}})

    await Section.findByIdAndDelete(sectionId);

    // find update course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

      res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    })
    }
    
    catch (error) {
    console.error("Error deleting section:", error)
    res.status(500).json({
      success: false,
      message:"unable to delete section , please try again",
      error: error.message,
    })
  }

}