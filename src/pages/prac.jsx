import { Link, useLocation } from "react-router-dom"
import { FaArrowRightLong } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPasswordResetToken, resetPassword, sendOtp, signUp } from "../services/operations/authAPI";

export const VerifyEmail = () => {

    const {signupData , loading} = useSelector( (state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const [otp,setOtp] = useState("");
 
    useEffect ( () => {
        if(!signupData)
        {
            navigate("/signup");
        }
    },[]);
    
    const handleOnSubmit = (event) => {
        event.preventDefault();
        const
    {accountType,
    firstName,
    lastName,
    email,
    password,
    confirmPassword} = signupData;

        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate));
    }

    return(
        <div>
            {
            loading ? 
            (
                <div>..loading</div>
            ) 
            :
            (
                <div>
                    <h1>
                        verify email
                    </h1>
                    <p>
                        verification code sent to you
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        
                            
                        <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    className="w-full p-6 bg-richblack-600 text-richblack-5"/>

                            
                        
                        <button type="submit">
                            verify email
                        </button>
                    </form>

                    <div>
                        <Link to={"/login"}>
                            <p>back to login</p>
                        </Link>
                        <button onClick={ () => dispatch(sendOtp())}>
                            reset it
                        </button>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export const UpdatePassword = () => {

    const [formData , setFormData] = useState(
        {
            password : "",
            confirmPassword : "",
        })
        
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
    const {loading} = useSelector( (state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();
    const {password,confirmPassword} = formData;

    const handleOnChange = (event) => {
        setFormData( (prevData) => (
            {...prevData,
            [event.target.name] : [event.target.value]}
        ))
    }

    const handleOnSubmit = (event) => {
        event.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password,confirmPassword,token,navigate));
    }
    return(
        <div>
            {
            loading ? 
            (
                <div>..loading</div>
            ) 
            :
            (
                <div>
                    <h1>
                        choose new password
                    </h1>
                    <p>
                        almost done.enter new password
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        
                            
                                <label>
                                    <p>new password</p>
                                    <input type = {showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    required = "true"
                                    placeholder="enter new password"
                                    onChange={handleOnChange}
                                    />
                                </label>
                            
                                <label>
                                    <p>new confirm  password</p>
                                    <input type = {showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    required = "true"
                                    placeholder="enter confirm password"
                                    onChange={handleOnChange}
                                    />
                                </label>
                        
                        <button type="submit">
                            reset password
                        </button>
                    </form>

                    <Link to={"/login"}>
                        <p>back to login</p>
                    </Link>
                </div>
            )
            }
        </div>
    )
}
export const ForgotPassword = () => {
    const [email,setEmail] = useState("");
    const [emailSent,setEmailSent] = useState(false);
    const {loading} = useSelector( (state) => state.auth);
    const dispatch = useDispatch();

    const handleOnSubmit = (event) => {
        event.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }
    return(
        <div>
            {
            loading ? 
            (
                <div>..loading</div>
            ) 
            :
            (
                <div>
                    <h1>
                        {
                            !emailSent ? "reset pass" : "check email"
                        }
                    </h1>
                    <p>
                        {
                            !emailSent ? "" : ""
                        }
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {
                            !emailSent && (
                                <label>
                                    <p>email address</p>
                                    <input type="email"
                                    name="email"
                                    value={email}
                                    required = "true"
                                    placeholder="enter email"
                                    onChange={ (event) => setEmail(event.target.value)}
                                    />
                                </label>
                            )
                        }
                        <button>
                            {
                                !emailSent ? "reset password" : "resend email"
                            }
                        </button>
                    </form>
                    <Link to={"/login"}>
                        <p>back to login</p>
                    </Link>
                </div>
            )
            }
        </div>
    )
}
const codeblock = () => {
    return(
        <div className={`flex ${position} gap-10`}>

            {/*section 1*/}
            <div className="flex-col w-[50%] flex gap-10">
                {/*heading*/}
                {heading}

                {/*subheading */}
                <div>
                    {subheading}
                </div>

                {/*button*/}
                <div className="flex gap-5">
                    <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                        <div className="flex gap-3 items-center">
                            {ctabtn1.btnText}
                            <FaArrowRightLong/>
                        </div>
                    </CTAButton>

                    <CTAButton>
                        
                    </CTAButton>
                </div>
            </div>

            {/*section 2*/}
            <div>
                <div>

                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}
const prac = () => {
    return (
        // main function
        <div>

            {/* section 1 */}
            <div className="relative mx-auto w-11/12 flex flex-col justify-between items-center 
            max-w-maxContent text-white ">

                {/* link for signup */}
                <Link to={"/signup"}>
                    <div className="rounded-full mx-auto bg-richblack-800 text-richblack-200
                    transition-all duration-75 hover:scale-95 w-fit font-bold p-1 mt-5">
                        <div className="flex gap-2 items-center ">
                            <p></p>
                            <FaArrowRightLong/>
                        </div>
                    </div>
                </Link>

                {/* text 1 */}
                <div className="text-center text-bold font-semibold">
                    empower your energy
                    <HighlightText />
                </div>

                {/* text 2 */}
                <div className="text-center text-lg w-[90%]">
                    empower your energy 3
                </div>

                {/* button */}
                <div className="flex gap-5">
                    <CTAButton active={true} linkto={"/signup"}>
                        learn more
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        new add
                    </CTAButton>
                </div>

                {/* images/video */}
                <div>
                    <video autoPlay muted loop>
                        <source src={banner} type="video/mp4"/>
                    </video>
                </div>

                {/* code section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading={
                            <div>
                                Unlock your
                                <HighlightText text={"coding potential"}/>
                                with online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry"
                        }
                        ctabtn1={
                            {
                                btnText : "try yourself",
                                linkto : "/signup",
                                active : true
                            }
                        }
                        ctabtn2={
                            {
                                btnText : "learn more",
                                linkto : "/login",
                                active : false,
                            }
                        }
                        
                    />
                </div>
                {/* code section 2 */}
                
            </div>

            {/* section 2 */}
            {/* section 3 */}
            {/* footer */}

        </div>
    )
}

<Route 
        element = {
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }>
        
          <Route path="/dashboard/my-profile" element={<MyProfile/>} />
          <Route path="/dashboard/Settings" element={<Settings/>} />
          {/* add setting */}
          {/* add cart */}
          {
            user?.accountType === "Student" && (
              <>
                <Route path="/dashboard/cart" element={<Cart/>} />
                <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses/>} />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/add-course" element={<AddCourse/>} />
              </>
            )
          }
          
        </Route>