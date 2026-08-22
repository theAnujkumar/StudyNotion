// app instance 
const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");

// import routes for server api
//const server = require("./routes/server");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const {cloudinaryConnect} = require("./config/cloudinary");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// load dotenv into config folder
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 4000;

database.connect();
cloudinaryConnect();

app.use(express.json());
// new add
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		//origin:"http://localhost:3000",
        origin: "*",
		credentials:true,
	})
)
app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);

// // mount api routes
// app.use("/api/v1",server);

// app.use('/api/v1/upload',Upload);
app.get('/',(req,res) => {
    return res.json({
        success : true,
        message:'Your server is up and running....'
    });
});


app.listen(PORT , () => {
    console.log(`app is listening at port ${PORT}`)
})

// use npm run dev only in server folder because it is backend

//http://localhost:4000/api/v1/auth
//http://localhost:4000/api/v1/profile
//http://localhost:4000/api/v1/course

