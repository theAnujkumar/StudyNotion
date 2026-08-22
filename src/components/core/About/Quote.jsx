import React from "react"
import HighlightText from "../HomePage/HighlightText"

const Quote = () => {
    return(
        <div>
            We are Passionate about revolution the way we want 
            <HighlightText text={"combines technology"}/>
            <span className="text-orange font-bold">
                {","}
                Expertise
                {","}
            </span>
            and community to create an 
            <span className="text-yellow-400 font-bold">
                unparalleled Educational experience
            </span>
        </div>
    )
}

export default Quote