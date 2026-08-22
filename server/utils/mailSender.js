const nodemailer = require('nodemailer')

const mailSender = async(email,title,body) => {
    try{
        // otp ko mail me send karna hai
        //transporter
        let transporter =  nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth: {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS,
            },
        });

        // send email
        let info = await transporter.sendMail({
            from:`study notion or codeHelp`,
            to: `${email}`,
            subject:`${title}`,
            html:`${body}`,
        })

        console.log("info",info);
        return info;
    }
    catch(error)
    {
        console.log(error.message);
    }
}

module.exports = nodemailer
module.exports = mailSender