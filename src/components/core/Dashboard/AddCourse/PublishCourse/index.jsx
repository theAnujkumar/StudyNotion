import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";

export default function PublishCourse()
{
    const {course} = useSelector((state) => state.course);
    const {token} = useSelector((state) => state.auth);
    const [loading , setLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        // formState : {errors},
    } = useForm()

    useEffect(() => {
        if(course?.status === COURSE_STATUS.PUBLISHED)
        {
          setValue("public",true);
        }
    },[])

    const goToCourses = () => {
      dispatch(resetCourseState())
      navigate("dashboard/my-courses");
    }

    const handleCoursePublish = async() =>  {
      // check is form updated or not
      if((course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) 
        ||  (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false))
      {
        // form has not been updated
        // no need to call api
        goToCourses()
        return
      }
      console.log("checkbox value:", getValues("public"));
      console.log("course for publish course:", course);
      console.log("courseId for publish course:", course?._id);

      // for making new form data
      const formData = new FormData();
      formData.append("courseId" , course._id);
      const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED 
      : COURSE_STATUS.DRAFT
      formData.append("status",courseStatus);

      console.log("formdata of publish is",formData);
      console.log("course ",course);
      console.log("course id",course?._id);
      for (let [key, value] of formData.entries()) {
      console.log(key, value);
      }

      setLoading(true)

      const result = await editCourseDetails(formData,token);
      console.log("result of publish course is",result);

      if(result)
      {
        goToCourses()
      }
      setLoading(false);

    }

    const goBack = () => {
      dispatch(setStep(2));
    }

    const onSubmit = (data) => {
      console.log("data" , data);
      handleCoursePublish()
    }


  return(
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* check box */}
        <div>
          <label htmlFor="public">
            <input
              id="public"
              type="checkbox"
              {...register("public")}
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* next prev button */}
        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex items-center rounded-md bg-richblack-300 p-6">
            Back
          </button>
          <IconBtn text="Save Changes"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  )
}

/*
disabled={loading}
jabh loading true ho tabh koi action na ho ye click na ho paye
*/