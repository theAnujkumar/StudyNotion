// insert into course also
const mongoose = require("mongoose")
//const { default: mongoose } = require("mongoose");
const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

// createRating
// getAverageRating
// getAllRating

// createRating
exports.createRating = async(req,res) => {

    try{
        // get user id
        const userId = req.user.id;

        // fetch data
        const {rating , review , courseId} = req.body;
    
        // check if user enrolled or not 
        const courseDetails = await Course.findOne(
                        {_id : courseId,
                            studentsEnrolled: {$elemMatch : {$eq : userId} },
                        }
        );

        if(!courseDetails)
        {
            return res.status(404).json({
                    success:false,
                    message:"student is not enrolled in this course",
                });
        }

        // check if user already reviewed or not 
        const alreadyReviewed = await RatingAndReview.findOne({
            user : userId,
            courseId : courseId,
        });

        if(alreadyReviewed)
        {
            return res.status(404).json({
                    success:false,
                    message:"course is already reviewed by user",
                });
        }
    
        // create entry into db
        const ratingReview = await RatingAndReview.create({
            rating,review,
            course : courseId,
            user : userId,
        });

        // course update with rating and reviews
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                        {
                            $push : {
                                ratingAndReviews : ratingReview._id,
                            }
                        },
                        {new:true}
        );

        console.log(updatedCourseDetails);
        
        // return response
        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            ratingReview,
        });
    
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot create course successfully",
        });
    }
    
}


// getAverageRating
exports.getAverageRating = async(req,res) => {
    try{
        // get course id
        const courseId = req.body.courseId;

        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course : new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group : {
                    _id : null,
                    averageRating : {$avg: "$rating"},
                }
            }
        ])

        // An aggregate function performs a 
        // calculation on a set of values, and returns a single value
        
        // rating and reviews ke andar esi entry find out kar ke do jiske course 
        // ke field me ye vale id ho
        
        // return rating
        if(result.length >= 0)
        {
            return res.status(200).json({
            success:true,
            message:"rating and review get successfully",
            averageRating : result[0].averageRating,
        });
        }

        // if no rating and review exist
        return res.status(400).json({
            success:false,
            message : "average rating is 0 , no rating given till now",
            averageRating : 0
        })
        // return response

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot create course successfully",
        });
    }
}


// getAllRatingAndReviews
exports.getAllRatingReview = async(req,res) => {
    try{
        // fetch data
        const allReviews = await RatingAndReview.find({})
                                .sort({rating : "desc"})
                                .populate({
                                    path : "user",
                                    select : "firstName lastName email image",
                                })
                                .populate({
                                    path : "course",
                                    select : "courseName",
                                })
                                .exec();

        return res.status(200).json({
            success:true,
            message:"all rating and reviews fetch successfully",
            data : allReviews,
        });
    }
    
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"cannot fetch all rating and reviews",
        });
    }
}
