import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//import IconBtn from "../../../common/IconBtn";
import { MdEdit } from "react-icons/md"
import ConfirmationModal from "../../../common/ConfirmationModal";
import { RiDeleteBin6Line } from "react-icons/ri"
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table"
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { COURSE_STATUS } from "../../../../utils/constants";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { formatDate } from "../../../../services/formatDate";
import { FaCheck } from "react-icons/fa"
import { HiClock } from "react-icons/hi"
// import { setCourse } from "../../../../slices/courseSlice";


export default function CoursesTable({courses,setCourses})  {
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading ,setLoading] = useState(false);
  const [confimationModal,setConfimationModal] = useState(null)
  const TRUNCATE_LENGTH = 30

  const handleCourseDelete = async(courseId) => {
    setLoading(true);
    console.log("course id ",courseId);

    await deleteCourse({courseId:courseId} , token)
    const result = await fetchInstructorCourses(token);
    if(result)
    {
      console.log("result of deleted course is",result);
      setCourses(result);
    }
    setConfimationModal(null)
    setLoading(false)
  }
  console.log("courses ",courses);

  //   to do delete all courses at once

  return(
   <>
    <Table className="rounded-xl border border-richblack-800 ">
      <Thead>
       <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </Th>
        </Tr>
      </Thead>

      <Tbody>
        {
          courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses Found
              </Td>
            </Tr>
          ) :
          (
            courses.map((course) => (
              <Tr key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8">
                <Td className="flex flex-1 gap-x-4">
                  <img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-5">
                      {course?.courseName}
                    </p>
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription.split(" ").length >
                      TRUNCATE_LENGTH
                        ? course.courseDescription
                            .split(" ")
                            .slice(0, TRUNCATE_LENGTH)
                            .join(" ") + "..."
                        : course.courseDescription}
                    </p>
                    <p className="text-[12px] text-white">
                      Create : {formatDate(course.createdAt)}
                    </p>

                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </div>
                        Published
                      </p>
                    )}
                  </div>

                </Td>

                {/* duration , time , action */}
                <Td className="text-sm font-medium text-richblack-100">
                  2hr 30min
                </Td>
                <Td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`dashboard/edit-course/${course._id}`)
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                    >
                    <MdEdit className="text-xl text-richblack-300" size={20} />
                  </button>
                  <button
                   disabled={loading}
                   onClick={() => {
                    setConfimationModal({
                      text1 : "Do you want to delete this course",
                      text2 : "All lectures",
                      btn1Text : "Delete",
                      btn2Text : "Cancel",
                      btn1Handler : !loading ? () => handleCourseDelete(course._id) : ()=>{} ,
                      btn2Handler : !loading ? () => setConfimationModal(null) : ()=>{} ,
                    })                    
                   }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]">
                    <RiDeleteBin6Line/>
                  </button>
                </Td>
              </Tr>
            ))
          )
        }
      </Tbody>
    </Table>
    {confimationModal && <ConfirmationModal modalData={confimationModal}/>}
   </>
  )
}