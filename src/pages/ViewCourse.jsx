import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar";
import { Outlet } from "react-router-dom";
import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal";

const ViewCourse = () => {

  const {courseId} = useParams();
  const {token} = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal,setReviewModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId,token)
      //console.log("Course Data here... ", courseData.courseDetails)

      //console.log("Complete Course Data:", courseData);

      if (!courseData || !courseData.courseDetails) {
        console.log("courseDetails not found");
        return;
      }

      dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
      dispatch(setEntireCourseData(courseData.courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos))
      let lectures = 0
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
  },[])
  return(
    <div>
      <div>
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
        <div>
          <div>
            <Outlet/>
          </div>
        </div>
      </div>
      {/* review slider part */}
      {/* reviewModal &&  */}
      { reviewModal && <CourseReviewModal setReviewModal={setReviewModal}/>  }
    </div>
  )
}

export default ViewCourse