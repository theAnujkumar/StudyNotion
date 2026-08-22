// import mongoose library
const mongoose = require('mongoose');

// define user schema using mongoose schema constructor
const userSchema = new mongoose.Schema({

    // Define the name field with type String, required, and trimmed
    firstName :{
        type : String,
        required : true,
        trim : true,
    },
    lastName :{
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type:String,
        required : true,
        trim:true,
    },
    password :{
        type : String,
        required : true,
        trim : true,
    },

    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType :{
        type : String,
        required : true,
        enum : ["Admin","Instructor","Student"]
    },
    active: {
			type: Boolean,
			default: true,
		},
		approved: {
			type: Boolean,
			default: true,
		},
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "Profile",
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course",
        }
    ],
    image : {
        type : String,
        required : true,
    },
    token :{
        type : String,
    },
    resetPasswordExpires : {
        type : Date,
    },
    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "CourseProgress",
        }
    ],
},
    // Add timestamps for when the document is created and last modified
    {timestamps:true}
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("User",userSchema);