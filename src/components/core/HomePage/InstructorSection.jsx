import React from "react"
import HighlightText from "./HighlightText"
import Instructor from "../../../assets/Images/Instructor.png"
import CTAbutton from "../HomePage/Button"
import { FaArrowRight } from "react-icons/fa6"

const InstructorSection = () => {
    return(
        <div className="mt-16">
            <div className="flex flex-row gap-20 items-center">
                <div className="w-[50%]">
                    <img src={Instructor} alt="instructor" 
                    className="shadow-white"/>
                </div>

                <div className="flex flex-col w-[50%] gap-10">
                    <div className="text-4xl font-semibold w-[50%]">
                        Become an 
                        <HighlightText text={"instructor"}/>
                    </div>
                    <p className="font-medium text-[15px] text-richblack-300 w-[90%]">
                        instructor from around the world teach millions of student
                        on studyNotion . we provide the tools and skill to teach you
                    </p>
                    <div className="w-fit">
                        <CTAbutton active={true} linkto={"/signup"}>
                        <div className="flex flex-row gap-2 items-center">
                            Start technology today
                            <FaArrowRight/>
                        </div>
                        </CTAbutton>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default InstructorSection