import React from "react";
import { FooterLink2 } from "../../data/footer-links";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
    return(
        <div className="bg-richblack-800">

            {/* upper footer */}
            <div className="flex text-richblack-400 lg-flex-row gap-6 justify-between items-center max-w-maxContent leading-8 mx-auto py-14 relative">
                <div className="w-[100%] flex flex-col lg:flex-row gap-12 border-b pb-5 border-richblack-700">
                    {/* section 1 left part */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between lg:border-r lg:border-richblack-700 gap-3 lg:pr-5 pl-3">

                        {/* study notion */}
                        <div className="w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0">
                            <img src={Logo} alt="" className="object-contain" />
                            <h1 className="text-richblack-50 font-semibold text-[16px]">Company</h1>

                            <div className="flex flex-col gap-2">
                                {
                                    ["About","Carriers","Affilaties"].map((element,index) => {
                                        return(
                                            <div key={index}
                                                className="text-[16px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                <Link to={element.toLowerCase()}>
                                                    {element}
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div className="flex gap-3 text-lg">
                                <FaFacebook />
                                <FaGoogle />
                                <FaTwitter />
                                <FaYoutube />
                            </div>
                        </div>

                        {/* resources and support */}
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1
                                className="text-richblack-50 font-semibold text-[16px]">
                                Resources
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {
                                    Resources.map((element,index) => {
                                        return(
                                            <div key={index}
                                            className="text-[16px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                <Link to={element.split(" ").join("-").toLocaleLowerCase()}>
                                                    {element}
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Support
                            </h1>
                            <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                                <Link to={"/help-center"}>Help Center</Link>
                            </div>
                        </div>

                        {/* plans community */}
                        <div className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                            <h1 className="text-richblack-50 font-semibold text-[16px]">
                                Plans
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {
                                    Plans.map((element,index) => {
                                        return(
                                            <div key={index}
                                                className="text-[16px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                <Link to={element.split(" ").join("-").toLocaleLowerCase()}>
                                                    {element}
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <h1 className="text-richblack-50 font-semibold text-[16px] mt-7">
                                Community
                            </h1>
                            <div className="flex flex-col gap-2 mt-2">
                                {
                                    Community.map((element,index) => {
                                        return(
                                            <div key={index}
                                                className="text-[16px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                                                <Link to={element.split(" ").join("-").toLocaleLowerCase()}>
                                                    {element}
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {/* section 2 right part */}
                    <div className="lg:w-[50%] flex flex-wrap flex-row justify-between gap-3 lg:pl-5 pl-3">
                        {
                            FooterLink2.map((element,index) => {
                                return (
                                    <div key={index}>
                                        <h1>
                                            {element.title}
                                        </h1>
                                        <div>
                                            {element.links.map((link,index) => {
                                                return(
                                                    <div key={index}>
                                                        {/* to={element.split(" ").join("-").toLocaleLowerCase()}
                                                        here we don't use this because link are already in array of footerLink */}
                                                        <Link to={link.link}>
                                                            {link.title}
                                                        </Link>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

            {/* lower footer */}
            <div className="flex flex-row justify-between">
                {/* both lower come */}
                <div className="flex flex-col lg:flex-row text-richblack-400">
                    {/* lower ka first part */}
                    <div className="flex flex-row gap-3">
                        {
                            BottomFooter.map((element,index) => {
                                return (
                                    <div key={index}
                                        className={` ${BottomFooter.length -1 === index
                                            ? "" :
                                            "border-r"
                                        }`}>

                                        <Link to={element.split(" ").join("-").toLocaleLowerCase()}>
                                            {element}
                                        </Link>
                                    </div>
                                )
                            })
                            
                        }
                    </div>
                    <div className="text-center">Made with ❤️ Anuj © 2026 Studynotion</div>
                </div>
            </div>
        </div>
    )
}
export default Footer;