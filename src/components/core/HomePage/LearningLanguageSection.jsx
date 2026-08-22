import React from "react";
import HighlightText from "./HighlightText";
import CTAButton from "../HomePage/Button";
import Know_your_progress from "../../../assets/Images/Know_your_progress.png"
import Compare_with_others from "../../../assets/Images/Compare_with_others.png"
import Plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png"

const LearningLanguageSection = () => {
    return(
        <div className="w-11/12 mt-[120px] mb-32">
            <div className="flex flex-col gap-5 items-center">
                <div className="text-4xl font-semibold text-center">
                    Your Swiss Knife For 
                    <HighlightText text={"learning for language"}/>
                </div>
                <div className="text-center text-richblack-500 text-base mx-auto
                 font-medium">
                    using spin making learning multiples language easy with 20+ languages
                    realistic voice-over,progress tracking
                </div>
                <div className="flex flex-row items-center justify-center mt-5">

                    <img src={Know_your_progress} alt="know" 
                    className="object-contain -mr-32"/>

                    <img src={Compare_with_others} alt="compare" 
                    className="object-contain"/>

                    <img src={Plan_your_lessons} alt="plan" 
                    className="object-contain -ml-32"/>
                </div>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn more
                </CTAButton>
            </div>
        </div>
    )
}
export default LearningLanguageSection;