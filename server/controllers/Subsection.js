const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async(req,res) => {
    try{
        // fetch data
        const {title , description , sectionId} = req.body;

        // extract video/file
        const video = req.files.video;

        console.log("video",video);
        console.log("title",title);
        console.log("description",description);
        console.log("sectionId",sectionId);

        // validate
        // !video
        if(!title || !description || !sectionId || !video)
        {
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            });
        }

        // upload video to cloudinary and get secure video url
        const uploadDetails  = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        console.log(uploadDetails);

        // create subSection entry into db
        const subSectionDetails = await SubSection.create({
            title : title,
            //timeDuration : `${uploadDetails.duration}`,
            timeDuration : "2min",
            description : description,
            videoUrl : uploadDetails.secure_url,
        })

        // update section with this subsection objid 
        const updatedSection = await Section.findByIdAndUpdate(
            {_id : sectionId},
            {
                $push : {
                    subSection : subSectionDetails._id,
                }
            },
            {new:true},
        ).populate("subSection")

        // return response
        return res.status(200).json({
            success:true,
            message:"sub section created successfully",
            data : updatedSection,
        });
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"unable to create subsection , please try again",
            error:error.message,
        });
    }
}


exports.updateSubSection = async(req,res) => {
    try{
        // fetch data
        const {title , description , sectionId , subSectionId} = req.body;

        const subSection = await SubSection.findById(subSectionId);

        if(!subSection)
        {
            return res.status(404).json({
                success:false,
                message:"sub section not found",
            });
        }

        if(title !== undefined)
        {
            subSection.title = title;
        }

        if(description !== undefined)
        {
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined)
        {
            const video = req.files.video;
            console.log("video is ",video);
            const uploadDetails = await uploadImageToCloudinary(video , process.env.FOLDER_NAME)

            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`;
            //subSection.timeDuration = "2min";
        }
        console.log("subsection details ",subSection)
        await subSection.save();

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")
        console.log("updated section",updatedSection)

        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:"subsection updated successfully",
        });

    }

    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:"An error occurred while updating the section",
            error:error.message,
        });
    }
}


exports.deleteSubSection = async(req,res) => {
    try{
        // get id 
        const {sectionId , subSectionId} = req.body;

        await Section.findByIdAndUpdate(
            {_id : sectionId},
            {
                $pull: {
                    subSection : subSectionId,
                }
            }
        )

        // find by id and delete
        const subSection = await SubSection.findByIdAndDelete({_id : subSectionId});

        if(!subSection)
        {
            return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate("subSection")

        // return response
        return res.status(200).json({
            success:true,
            data:updatedSection,
            message:"subsection deleted successfully",
        });
    }
    
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message: "An error occurred while deleting the SubSection",
            error:error.message,
        });
    }
}