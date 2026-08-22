import React from "react";
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"


const timeline = [
    {
        Logo : Logo1,
        heading : "Leadership",
        description : "fully commited to sucess company"
    },
    {
        Logo : Logo2,
        heading : "Leadership",
        description : "fully commited to sucess company"
    },
    {
        Logo : Logo3,
        heading : "Leadership",
        description : "fully commited to sucess company"
    },
    {
        Logo : Logo4,
        heading : "Leadership",
        description : "fully commited to sucess company"
    },
]
const TimelineSection = () => {
    return(
        <div className="flex flex-row gap-15 items-center">
            <div className="w-[40%] flex flex-col gap-5">
                {
                    timeline.map( (element,index) => {
                        return(
                            <div className="flex flex-row gap-3 "key={index}>
                                <div className="w-[50px] h-[50px] bg-white flex items-center">
                                    <img src={element.Logo} alt="logo"/>
                                </div>

                                <div>
                                <p className="font-semibold text-[17px]">{element.heading}</p>
                                <p className="text-base">{element.description}</p>
                                </div>
                            </div>

                        )
                    })
                }

            </div>

            <div className="relative shadow-blue-200">

                <img src={timelineImage} alt="timelineimage" 
                className="shadow-white object-cover h-fit" />

                <div className="absolute flex flex-row bg-caribbeangreen-700
                 text-white uppercase py-8 left-[20%] translate-x-[-50px] translate-y-[-50px] ">
                    <div className="flex flex-row text-white items-center gap-4
                     border-caribbeangreen-300 border-r px-5">
                        <p className="text-3xl font-bold">10</p>
                        <p className="text-caribbeangreen-300 text-sm ">Years of Experience</p>
                    </div>

                    <div className="flex flex-row text-white items-center gap-4
                     border-caribbeangreen-300 border-r px-5">
                        <p className="text-3xl font-bold">250</p>
                        <p className="text-caribbeangreen-300 text-sm ">Type of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TimelineSection;