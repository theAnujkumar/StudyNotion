import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { IoAddCircleOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux";
import { setCourse, setEditCourse, setStep } from "../../../../../slices/courseSlice";
import { createSection, updateSection } from "../../../../../services/operations/courseDetailsAPI";
import NestedView from "./NestedView";
import toast from "react-hot-toast";

const CourseBuilderForm = () => {

    const {register , handleSubmit , setValue , formState : {errors}} = useForm()
    const[editSectionName,setEditSectionName] = useState(null)
    const {course} = useSelector((state) => state.course);
    const dispatch = useDispatch()
    const {token} = useSelector((state) => state.auth);
    const[loading , setLoading] = useState(false);

    // check
    // useEffect( () => {
    //     console.log("edit section name",editSectionName)
    // },[]);

    const onSubmit = async(data) => {
    console.log("data",data);
      setLoading(true);

      let result
      if(editSectionName)
      {
        // we are editing section name
        result = await updateSection(
         {
          sectionName : data.sectionName,
          sectionId : editSectionName,
          courseId : course._id,
         },
         token
        )
      }

      // first time come in courseBuilder section to create section
      else{
       result = await createSection(
        {
          sectionName : data.sectionName,
          courseId : course._id,
        },
        token
       )
      }

      console.log("result of section is ",result);
      // update course values because of adding section
      if(result)
      {
        console.log("section name",data.sectionName);
        dispatch(setCourse(result))
        setEditSectionName(null)
        setValue("sectionName", "")
      }
      setLoading(false)
    }

    const cancelEdit = () => {
        setEditSectionName(null);
        setValue("sectionName","");
    }

    const goBack = () => {
        dispatch(setStep(1));
        // doing edit course not create
        // because course already create
        dispatch(setEditCourse(true));
    }

    const goToNext = () => {
        console.log("course content",course.courseContent);
        console.log("courseContentlength",course.courseContent.length);
        if(course.courseContent.length === 0)
        {
            toast.error("Please add atleast one section");
            return 
        }
        if(course.courseContent.some((section) => section.subSection.length === 0))
        {
            console.log("course content", course.courseContent)
            //console.log("subsection length",section.subSection.length)
            toast.error("Please add atleast one lecture in each section");
            return 
        }
        // const emptySection = course.courseContent.find(
        // (section) => section.subSection.length === 0
        // );

        // if (emptySection) {
        // console.log("course content", course.courseContent);
        // console.log("subsection length", emptySection.subSection.length);
        // toast.error("Please add atleast one lecture in each section");
        // return;
        // }

        // everything is right
        dispatch(setStep(3));
    }

    // mistake
    //const handleChangeEditSectionName = ({sectionId , sectionName}) => {
    const handleChangeEditSectionName = (sectionId , sectionName) => {
        // toggle sectionid
        console.log("edit section name " , editSectionName)
        console.log("edit section id " , sectionId)
        console.log("section name " , sectionName)
        if(editSectionName === sectionId)
        {
            cancelEdit();
            return ;
        }
        setEditSectionName(sectionId);
        setValue("sectionName",sectionName);
    }

    return(
        <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
            <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col space-y-2">
                    <label htmlFor="sectionName" className="text-sm text-richblack-5"
                    >Section name <sup>*</sup></label>
                    <input 
                    id="sectionName"
                    placeholder="Enter section name"
                    {...register("sectionName" , {required:true})}/>
                    {
                        errors.sectionName && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200"
                            >Section Name is required</span>
                        )
                    }
                </div>

                <div className="flex">
                    <IconBtn
                    type="submit"
                    disabled={loading}
                    text={editSectionName ? "Edit Section Name" : "Create Section"}
                    outline={true}
                    customClasses={"text-white"}
                    >
                        <IoAddCircleOutline size={20} className="text-yellow-50" /> 
                    </IconBtn>

                    {
                        editSectionName && (
                            <button onClick={cancelEdit}
                            className="text-sm underline text-richblack-300">
                                Cancel edit
                            </button>
                        )
                    }
                </div>
            </form>

            {
                course?.courseContent?.length > 0 && (
                    <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
                )
            }

            <div className="flex justify-end gap-x-3">
                <button onClick={goBack}
                className={`flex cursor-pointer items-center gap-x-2 rounded-md
                 bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                    Back
                </button>
                <IconBtn type="Next"
                onclick={goToNext}>
                    Next
                </IconBtn>
            </div>
        </div>
    )
}

export default CourseBuilderForm


/*
remember editSectionName, updatesection , createsection

*/
