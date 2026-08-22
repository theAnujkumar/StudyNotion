import React from "react";
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice"; 
import { useDispatch, useSelector } from "react-redux";

//const CourseDetailsCard = ({course,setConfirmationModal,handleBuyCourse}) => {

export default function CourseDetailsCard({course,setConfirmationModal,handleBuyCourse}) {
  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log("course is " , course);

  const {
    thumbnail : thumbnailImage,
    price : CurrentPrice,
    _id : courseId
  }  = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    // if user is instructor
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR)
    {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    // if admin or student then 
    if(token)
    {
      console.log("dispatch add to cart")
      dispatch(addToCart(course))
      return
    }

    // not token and not instructor
    // not valid user
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // user me course ki id _id
  //console.log("Student already enrolled ", course?.studentsEnrolled, user?._id)

  return(
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
      <img src={thumbnailImage} 
      alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full" 
      />

      <div className="px-4">

      <div className="space-x-3 pb-4 text-3xl font-semibold">
        Rs. {CurrentPrice}
      </div>
      <div className="flex flex-col gap-4">
        <button 
            className="yellowButton"
            onClick={
                user && course?.studentsEnrolled.includes(user?._id) 
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }>
            {/* if user already buy or enroll in course then show go to courses
            else buy now */}
            {user && course?.studentsEnrolled.includes(user?._id)
              ? "Go To Course" 
              : "Buy Now"}
        </button>

        {/* if user not already buy or enroll in course then show add to cart */}
        {(!user || !course?.studentsEnrolled.includes(user?._id))  && (
            <button onClick={handleAddToCart}
              className="blackButton">
                Add to cart
            </button>
        )}
      </div>
      <div>
         <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Day Money-Back Guarantee
          </p>
      </div>
      <div className={``}>
        <p className={`my-2 text-xl font-semibold `}>
          This Course Includes :
        </p>
        <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
           {
            course?.instructions?.map((item,i) => {
              return(
                <p key={i} className={`flex gap-2`}>
                  <BsFillCaretRightFill />
                  <span>{item}</span>
                </p>
              )
            })
           }
        </div>
      </div>
      <div className="text-center">
        <button className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
          onClick={handleShare}>
          <FaShareSquare size={15}/>  Share
        </button>
      </div>

      </div>
    </div>
  )
}

//export default courseDetailsCard