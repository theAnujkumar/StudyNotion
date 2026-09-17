import React, { useEffect, useState } from "react";
import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../common/RatingStars"
import { Link } from "react-router-dom";
//import { FaRegStar, FaStar } from "react-icons/fa"

const Course_Card = ({course,Height}) => {

  const [avgReviewCount , setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  },[course])

  //console.log("course",course)
  //console.log("course instructor ",course?.instructor)
  //console.log("course instructor first name",course?.instructor?.firstName)

  return(
    <>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              {/* <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> */}
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  )
  // return(
  //   <div>
  //     <Link to={`/courses/${course._id}`}>
  //       <div>
  //         <div>
  //           <img 
  //             src={course?.thumbnail}
  //             alt="course thumbnail"
  //             className={`${Height} w-full rounded-xl object-cover `}
  //             />
  //         </div>
  //         <div>
  //           <p className="text-xl text-richblack-5">{course?.courseName}</p>
  //           <p className="text-sm text-richblack-50">
  //             {course?.instructor?.firstName} {course?.instructor?.lastName}
  //           </p>
  //           <div>
  //             <span>{avgReviewCount || 0}</span>
  //             <RatingStars Review_Count={avgReviewCount}/>
  //             <span className="text-richblack-400">
  //               {course?.ratingAndReviews?.length} Ratings
  //             </span>
  //           </div>
  //           <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
  //         </div>
  //       </div>
  //     </Link>
  //   </div>
  // )
}

export default Course_Card