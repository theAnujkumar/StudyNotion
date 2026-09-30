import React, { useEffect, useState } from "react"
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import {NavbarLinks} from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {AiOutlineShoppingCart} from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { BsChevronDown } from "react-icons/bs"
//import { IoIosArrowDropdownCircle } from "react-icons/io";

// const subLinks = [
//     {
//         title : "Python",
//         link : "catalog/python"
//     },
//     {
//         title : "web dev",
//         link : "catalog/web-development"
//     }
// ];
// console.log(subLinks)

const createCategorySlug = (name = "") => {
    return String(name)
        .trim()
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};

const Navbar = () => {

    const {token} = useSelector( (state) => state.auth );
    const {user} = useSelector ( (state) => state.profile);
    const {totalItems} = useSelector ( (state) => state.cart);
    const location = useLocation();
    const [loading,setLoading] = useState(false);

    const [subLinks , setSubLinks] = useState([]);

    const fetchSubLinks = async() => {
            setLoading(true)
            try{
                const result = await apiConnector("GET",categories.CATEGORIES_API);
                // console.log("printing sublinks data",result);
                // console.log("printing sublinks data",result?.data);
                // console.log("printing sublinks data",result?.data?.data);
                setSubLinks(result.data.data);
            }
            catch(error)
            {
                console.log("could not fetch category list");
            }
            setLoading(false)
        }

    useEffect( () => {
        //api call
        fetchSubLinks()

        //console.log("Updated subLinks:", subLinks);
        // console.log("loading data" , loading)
        // console.log("NavbarLinks", NavbarLinks);
    }, [] );

    // console.log("Updated subLinks:", subLinks);
    // console.log("Updated subLinks of [0]:", subLinks[0]);

    const matchRoute = (route) => {
        return matchPath({path:route} , location.pathname);
    }

    return(
        <div className="flex justify-center items-center h-14 border-b-[1px] border-b-richblack-700">
            <div className="flex w-11/12 max-w-maxContent items-center justify-between">
                {/* images */}
                <Link to="/">
                    <img src={logo} alt="logo"  width={160} height={42} loading="lazy"/>
                </Link>

                {/* nav links */}
                <nav className="hidden md:block">
                <ul className="flex gap-x-6 text-richblack-25">
                    {NavbarLinks.map((link, index) => (
                    <li key={index}>
                        {link.title === "Catalog" ? (
                        <>
                            <div
                            className={`group relative flex cursor-pointer items-center gap-1 ${
                                matchRoute("/catalog/:catalogName")
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}
                            >
                            <p>{link.title}</p>
                            <BsChevronDown />
                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] 
                            translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4
                             text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible
                              group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">

                                <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] 
                                translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5">
                                </div>
                        
                                {loading ? (
                                <p className="text-center">Loading...</p>
                                ) : subLinks.length ? (
                                    subLinks.map((subLink, index) => (
                                    <Link
                                        key={index}
                                        to={`/catalog/${createCategorySlug(subLink.name)}`}
                                    >
                                        <p>{subLink.name}</p>
                                    </Link>
                                    ))
                                ) : (
                                    <div>No Course Found</div>
                                )
                                }
                                
                            </div>
                            </div>
                        </>
                        ) : (
                        <Link to={link?.path}>
                            <p
                            className={`${
                                matchRoute(link?.path)
                                ? "text-yellow-25"
                                : "text-richblack-25"
                            }`}
                            >
                            {link.title}
                            </p>
                        </Link>
                        )}
                    </li>
                    ))}
                </ul>
                </nav>


                {/* login/signup/dashboard */}
                <div className="flex gap-x-4 items-center">
                    {
                        // why reach on this
                        user && user?.accountType !== "Instructor" && (
                            <Link to="/dashboard/cart" className="relative">
                                <AiOutlineShoppingCart/>
                                {
                                    totalItems > 0 && (
                                        <span>
                                            {totalItems}
                                        </span>
                                    )
                                }
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/login">
                                <button className="border border-richblack-700 px-[12px] py-[8px]
                                rounded-md bg-richblack-800 text-richblack-100">
                                    login
                                </button>
                            </Link>
                        )
                    }
                    {
                        token === null && (
                            <Link to="/signup">
                                <button className="border border-richblack-700 px-[12px] py-[8px]
                                rounded-md bg-richblack-800 text-richblack-100">
                                    signup
                                </button>
                            </Link>
                        )
                    }
                    {
                        token !== null && <ProfileDropDown/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar

// {/*
//                 <nav>
//                     <ul className="flex gap-x-6 text-richblack-25">
//                         {
//                             NavbarLinks.map((link,index) => (
//                                 <li key={index}>
//                                     {
//                                         link.title === "Catalog" ? (
//                                         <div className="relative flex flex-row items-center gap-2 group">
//                                             <p>{link.title}</p>
//                                             <IoIosArrowDropdownCircle/>

//                                             {/* <div className="invisible absolute flex flex-col
//                                             left-[50%] translate-x-[-50%] translate-y-[50%]
//                                             top-[50%] p-4
//                                             rounded-md bg-richblack-5 text-richblack-900
//                                             opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100
//                                             lg-w-[300px]"> */}

//                                             {/* <div className="absolute left-[50%] top-0 h-6 w-6
//                                             rounded-md bg-richblack-5 rotate-45 translate-x-[80%]
//                                             translate-y-[-10%]"> */}

//                                             {/* <div className='invisible absolute left-[50%]
//                                             translate-x-[-50%] translate-y-[40%]
//                                             top-[50%]
//                                             flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
//                                             opacity-0 transition-all duration-200 group-hover:visible
//                                             group-hover:opacity-100 lg:w-[300px]'>

//                                             <div className='absolute left-[50%] top-0
//                                             translate-x-[80%]
//                                             translate-y-[-45%] h-4 w-4 rotate-45 rounded bg-richblack-5'>
//                                             </div>

//                                             {
//                                                 subLinks.length ? (
//                                                     subLinks.map ( (subLink , index) => (
//                                                         <Link to={`${subLink.link}`} key={index}>
//                                                             <p>{subLink.title}</p>
//                                                         </Link>
//                                                     ))
//                                                 ) : (<div>
//                                                     </div>)
//                                             }

//                                             </div>
//                                         </div>
//                                     ) : 
//                                         (
//                                            <Link to={link?.path}>
//                                               <p className=
//                                               {`${ matchRoute(link?.path) ? "text-yellow-25" 
//                                                 : "text-richblack-25"}`
//                                               }>
//                                                 {link.title}
//                                               </p>
//                                            </Link>
//                                         )
                                        
//                                     }
                                    
//                                 </li>
//                             ))
//                         }
//                     </ul>
//                 </nav> */}

// {loading ? (
//                           <p className="text-center">Loading...</p>
//                         ) : subLinks.length ? (
//                             subLinks.map((subLink, index) => (
//                             <Link
//                                 key={index}
//                                 to={`/catalog/${subLink.name
//                                 .split(" ")
//                                 .join("-")
//                                 .toLowerCase()}`}
//                             >
//                                 <p>{subLink.name}</p>
//                             </Link>
//                             ))
//                         ) : (
//                             <div>No Course Found</div>
//                         )
//                         }