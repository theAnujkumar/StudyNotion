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
    <div className="rounded-md border border-richblack-700 bg-richblack-800 p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-2xl font-semibold text-richblack-5">
          Publish Settings
        </p>
        <p className="text-sm text-richblack-300">
          Decide if this course should be visible to students.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* check box */}
        <div className="rounded-xl border border-richblack-700 bg-richblack-900/50 p-4 sm:p-5">
          <label htmlFor="public" className="flex cursor-pointer items-start gap-3">
            <input
              id="public"
              type="checkbox"
              {...register("public")}
              className="mt-1 h-4 w-4 accent-yellow-50"
            />
            <span className="text-sm text-richblack-200 sm:text-base">
              Make this course as public
            </span>
          </label>
        </div>

        {/* buttons of next/prev */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="flex items-center justify-center rounded-md bg-richblack-300 px-[20px] py-[8px] font-semibold text-richblack-900 transition hover:bg-richblack-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Back
          </button>
          <IconBtn
            text="Save Changes"
            disabled={loading}
            customClasses="justify-center"
            type="submit"
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