import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import ExploreMore from "../components/core/HomePage/ExploreMore"
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
    return(
        <div>
            {/* section 1 */}
            <div className='relative mx-auto w-11/12 max-w-maxContent items-center flex flex-col 
            text-white justify-between gap-8'>

                <Link to={"/signup"}>

                    <div className="group mt-16 p-1 mx-auto rounded-full font-bold bg-richblack-800
                    text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
                        <div className="flex items-center gap-2 rounded-full px-10 py-[10px] 
                        transition-all duration-200 group-hover:bg-richblack-900">
                            <p>become an instructor</p>
                            <FaArrowRightLong />
                        </div>
                    </div>

                </Link>

                <div className="font-semibold text-center text-4xl mt-7">
                    Empower Your future with
                    <HighlightText text={"Coding Skills"}/>
                </div>

                <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
                    With our online coding courses, you can learn at your own pace, from
                    anywhere in the world, and get access to a wealth of resources,
                    including hands-on projects, quizzes, and personalized feedback from
                    instructors.
                </div>
                
                {/* Button */}
                <div className="flex flex-row mt-8 gap-7">
                    <CTAButton active={true} linkto={"/signup"}>
                        Learn More
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                        Book a Demo
                    </CTAButton>
                </div>

                <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
                    <video
                    className="shadow-[20px_20px_rgba(255,255,255)]"
                    muted
                    autoPlay
                    loop
                    >
                    
                    <source src={banner} type="video/mp4"/>

                    </video>
                </div>

                {/* code section 1 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row"}
                        heading = {
                            <div className="text-4xl font-semibold w-[100%] lg-w-[100%]">
                                Unlock Your
                                <HighlightText text={"coding potential"}/>
                                with our online courses
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={
                            {
                                btnText : "try it yourself",
                                linkto : "/signup",
                                active : true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText : "learn more",
                                linkto : "/login",
                                active : false,
                            }
                        }

                        codeColor={"text-yellow-25"}
                        codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
                        backgroundGradient={<div className="codeblock1 absolute"></div>}
                        //codecolor={"text-yellow-25"}
                    />
                </div>

                {/* code section 2 */}
                <div>
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading = {
                            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                Start
                                <HighlightText text={"coding in seconds"}/>
                            </div>
                        }
                        subheading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText : "Continue Lesson",
                                linkto : "/signup",
                                active : true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText : "learn more",
                                linkto : "/login",
                                active : false,
                            }
                        }

                        codeColor={"text-white"}
                        codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                        backgroundGradient={<div className="codeblock2 absolute"></div>}
                    />
                </div>

                <ExploreMore/>

            </div>


            {/* section 2 */}
            <div className="bg-pure-greys-5 text-richblack-700">
                <div className="homepage_bg h-[320px]">
                    {/* explore full catalog section */}
                    <div className="w-11/12 max-w-maxContent flex items-center gap-8 mx-auto flex-col justify-between">

                        <div className="lg:h-[150px]"></div>

                        <div className="flex flex-row gap-7 text-white lg:mt-8">
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className="flex items-center gap-3">
                                Explore Full Catalog
                                <FaArrowRightLong/>
                            </div>
                        </CTAButton>

                        <CTAButton active={false} linkto={"/signup"}>
                            <div className="flex items-center gap-3">
                                Learn More
                                <FaArrowRightLong/>
                            </div>
                        </CTAButton>
                        </div>
                    </div>
                </div>

                <div className="w-11/12 mx-auto max-w-maxContent flex flex-col items-center 
                gap-7 justify-between mt-6">
                    
                    <div className="flex gap-5">
                        <div className="text-4xl font-semibold w-[45%]">
                            Get The Skills you need for a
                            <HighlightText text={"Job that is in demand"}/>
                        </div>

                        <div className="flex flex-col gap-5 w-[40%] items-start">
                            <div className="text-[16px]">
                                the modern studyNotion is the dicates its own terms.
                                today , to be a competitve specialist
                            </div>
                            <CTAButton active={true} linkto={"/signup"}>
                                Learn more
                            </CTAButton>
                    </div>
                    </div>

                    <TimelineSection/>
                    
                    <LearningLanguageSection/>

                </div>


            </div>
            
            {/* section 3 */}
            <div className="flex flex-col mx-auto w-11/12 max-w-maxContent items-center justify-between
            first-letter bg-richblack-900 text-white gap-8 ">

                <InstructorSection/>
                <h2 className="text-center font-semibold text-4xl mt-10">Review from others</h2>
                
                {/*review slider*/}
                <ReviewSlider/>

            </div>

            {/* footer */}
            <div>
                <Footer/>
            </div>
        </div>  
    )
}

export default Home;