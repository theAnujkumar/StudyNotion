import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import { VscAdd } from "react-icons/vsc"
import CoursesTable from "./InstructorCourses/CoursesTable";
import "./MyCourses.css";

export default function MyCourses()  {
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const [courses,setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async() => {
      const result = await fetchInstructorCourses(token)
      if(result)
      {
        setCourses(result)
      }
    }
    fetchCourses()
  },[])


  return(
    <div className="space-y-6">
      {/* navbar div */}
      <div className="my-courses-header">
        <h1 className="my-courses-title text-2xl font-medium text-richblack-5">
          My Courses
        </h1>
        <IconBtn  
          text="Add Courses"
          onclick={() => navigate("/dashboard/add-course")}>
            <VscAdd/>
        </IconBtn>
      </div>

      {/* table part */}
      {courses && <CoursesTable courses={courses} setCourses={setCourses}/>}

    </div>
  )

}