import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProgressBar from "@ramonak/react-progress-bar";
import { getUserEnrolledCourses } from "../../../services/operations/ProfileAPI";
import { useNavigate } from "react-router-dom";

const EnrolledCourses = () => {

    const {token} = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [enrolledCourses,setEnrolledCourses] = useState(null);
    const [loading, setLoading] = useState(true);

    const getEnrolledCourses = async() => {
        try{
            const response = await getUserEnrolledCourses(token);
            // console.log("response of get enroll courses ",response)
            // console.log("response of get enroll courses length ",response.length)

            // this give error to print
            //console.log("response data of get enroll courses ",response.data)
            //console.log("response data ka data of get enroll courses ",response.data.data)
            //console.log("enrolled courses ",enrolledCourses)
            setEnrolledCourses(response || []);
        }
        catch(error)
        {
            console.log("unable to fetch enrolled courses");
            setEnrolledCourses([]);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect( () => {
        getEnrolledCourses();
    },[]);

  return (
    <div className="w-full">
      <div className="mb-4 text-2xl font-semibold text-richblack-50 sm:text-3xl">Enrolled Courses</div>

      {loading ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid min-h-[120px] w-full place-content-center text-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-4 overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 text-richblack-5 sm:my-8">
          {/* Headings */}
          <div className="hidden md:flex rounded-t-lg bg-richblack-500">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`border-b border-richblack-700 last:border-b-0 ${
                i === arr.length - 1 ? "rounded-b-xl" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex cursor-pointer flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:gap-0 md:px-5"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <div className="flex items-center gap-4 md:w-[45%]">
                  <img
                    src={course.thumbnail}
                    alt="course_img"
                    className="h-16 w-16 rounded-lg object-cover sm:h-20 sm:w-20"
                  />
                  <div className="flex min-w-0 flex-col gap-2">
                    <p className="font-semibold text-richblack-5">{course.courseName}</p>
                    <p className="text-xs text-richblack-300 sm:text-sm">
                      {course.courseDescription?.length > 60
                        ? `${course.courseDescription.slice(0, 60)}...`
                        : course.courseDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:w-1/4 md:block md:px-2">
                  <span className="text-sm text-richblack-300 md:hidden">Duration</span>
                  <span className="text-sm md:text-base">{course?.totalDuration}</span>
                </div>

                <div className="flex flex-col gap-2 md:w-1/5 md:px-2">
                  <div className="flex items-center justify-between gap-3 md:block">
                    <p className="text-sm md:text-base">Progress: {course.progressPercentage || 0}%</p>
                  </div>
                  <ProgressBar
                    completed={course.progressPercentage || 0}
                    height="8px"
                    isLabelVisible={false}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
// Authorization check spelling in profileApi
export default EnrolledCourses