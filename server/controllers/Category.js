const Category = require("../models/Category");
const Course = require("../models/Course");

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
// change tag into category

// create category handler function

exports.createCategory = async (req,res) => {
    try{
        // fetch data 
        const {name,description} = req.body;

        // validation
        if(!name || !description)
        {
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }

        // create entry into db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);

        // return response
        return res.status(200).json({
            success:true,
            message:"category created successfully",
        })

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// getallcategories function handler (find)
exports.showAllCategories = async(req,res) => {

    try{
        //const allCategories = await Category.find({},{name:true ,description:true});
        const allCategories = await Category.find()
        //console.log("all categories of backend ",allCategories)
        return res.status(200).json({
            success:true,
            message:"all categories return successfully",
            data : allCategories,
        })
    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

// category page details
exports.categoryPageDetails = async(req,res) => {
    try{
        // fetch category id
        const {categoryId} = req.body;

        // get all courses corresponding to specific category id
        // const selectedCategory = await Category.findById(categoryId)
        //                                         .populate("courses")
        //                                         .exec();
        //                                         //not want refernce so populate

        //const updatedCategoryId = new Mongoose.Types.ObjectId(categoryId)
       const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
        populate: {
        path: "instructor",
        //select: "firstName lastName email",
    },
      })
      .exec()

      //console.log("SELECTED COURSE", selectedCategory)
        // validate
        if(!selectedCategory)
        {
            return res.status(404).json({
                success:false,
                message:"category not found",
            })
        }
        // Handle the case when there are no courses
        // if (selectedCategory.courses.length === 0) {
        // console.log("No courses found for the selected category.")
        // return res.status(404).json({
        //     success: false,
        //     message: "No courses found for the selected category.",
        // })
        // }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
        })

        // get courses for different category
        let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
        .populate({
            path: "courses",
            match: { status: "Published" },
        })
        .exec()

        // const differentCategory = await Category.find({
        //                             _id : {$ne : categoryId},
        //                         })
        //                         .populate("courses")
        //                         .exec();

        // get top selling courses
        const allCategories = await Category.find()
            .populate({
                path:"courses",
                match: { status: "Published" },

                // here do mistake for populating
                populate: {
                    path: "instructor",
                },
            })          
        .exec()  
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)                       

        // return response
        return res.status(200).json({
            success:true,
            data : {
                selectedCategory,
                differentCategory,
                mostSellingCourses,
            },
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
            message: "came in catch block of category page details"
        })
    }
}
