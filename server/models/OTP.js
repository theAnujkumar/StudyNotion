const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
    },
    otp : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        expires : 5*60,
    }
});

// a function-> to send emails
async function sendVerificationEmail (email,otp) {
    // Create a transporter to send emails

	// Define the email options

	// Send the email
    try {
        const mailResponse = await mailSender(email,"verification email from studyNotion",otp);
        console.log("email sent successfully: ",mailResponse);
    }
    catch(error)
    {
        console.log("errro occur while sending email: ",error);
        throw error;
    }
}

// document save hone se phele sendVerificationEmail function call honge
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});

module.exports = mongoose.model("OTP",OTPSchema);