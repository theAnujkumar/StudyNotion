const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        UseNewUrlParser:true,
        UseUnifiedTopology:true
    })
    .then(() => {console.log("db connection successfully")})
    .catch( (err) => {
        console.log("db connection unsuccessfully");
        console.error(err);
        process.exit(1);
    });
}