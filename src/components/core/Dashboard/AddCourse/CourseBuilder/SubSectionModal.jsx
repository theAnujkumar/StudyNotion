import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createSubSection, updateSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { RxCross2 } from "react-icons/rx"
import Upload from "../Upload";

export default function SubSectionModal({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false}) 
{
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState : {errors}
  } = useForm()

  // console.log("view", view)
  // console.log("edit", edit)
  // console.log("add", add)

  const dispatch = useDispatch()
  const {token} =  useSelector((state) => state.auth);
  const {course} = useSelector((state) => state.course);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    if(edit || view)
    {
      console.log("modal data" , modalData);
      // modal data backend part
      setValue("lectureTitle",modalData.title);
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  },[]);

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    // currrent values fronted part

    console.log("changes after editing values from" , currentValues);

    if(
     currentValues.lectureTitle !== modalData.title ||
     currentValues.lectureDesc !== modalData.description 
      || currentValues.lectureVideo !== modalData.videoUrl
    ) {
        return true
    }
    return false
  }

  const handleEditSubSection = async() => {
    const currentValues = getValues();
    console.log("changes after editing form values:", currentValues)
    const formData = new FormData();
    console.log("changes after editing form values:", currentValues)

    formData.append("sectionId",modalData.sectionId);
    formData.append("subSectionId",modalData._id);

    if(currentValues.lectureTitle !== modalData.title)
    {
      // left me backend part , right me frontend
     formData.append("title",currentValues.lectureTitle);
    }
    if(currentValues.lectureDesc !== modalData.description)
    {
     formData.append("description",currentValues.lectureDesc);
    }
    if(currentValues.lectureVideo !== modalData.videoUrl)
    {
      formData.append("video",currentValues.lectureVideo);
    }

    setLoading(true);
    const result = await updateSubSection(formData,token);
    if(result)
    {
      const updatedCourseContent = course.courseContent.map((section) => 
      section._id === modalData.sectionId ? result : section)
      
      const updatedCourse = {...course, courseContent:updatedCourseContent}
      dispatch(setCourse(updatedCourse))
    }
    setModalData(null);
    setLoading(false);
  }

  const onSubmit = async(data) => {
    if(view) return

    if(edit) {
      if(!isFormUpdated)
      {
        toast.error("no changes made to form");
      }
      else{
        // edit kar do store me
        handleEditSubSection()
      }
      return
    }

    // add new section , subsection
    const formData = new FormData()
    console.log("form data of subsection before append ",formData);
    // ye data jayenga backend api ke sath

    // left me backend part , right me frontend
    formData.append("sectionId",modalData);
    formData.append("title",data.lectureTitle);
    formData.append("description",data.lectureDesc);
    formData.append("video",data.lectureVideo);
    console.log("form data of subsection after append ",formData);
    console.log("lectureDesc:", data.lectureDesc);
    setLoading(true);
    // api call
    const result = await createSubSection(formData,token);

    if(result)
    {
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      )
      const updatedCourse = { ...course, courseContent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
      //dispatch(setCourse(result));
    }
    setModalData(null);
    setLoading(false);

    }

  return(
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* modal header part*/}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="flex items-center text-richblack-500"> 
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={ () => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* modal form */}
        <form onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 px-8 py-10">  
          <Upload
           name="lectureVideo"
           label="Lecture Video"
           register={register}
           setValue={setValue}
           errors={errors}
           video={true}
           viewData = {view ? modalData.videoUrl : null}
           editData = {edit ? modalData.videoUrl : null}
           />

            {/* lecture title */}
           <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title
            </label>
            <input 
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle",{required:true})}
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
           </div>

           {/* lecture description */}
           <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description
            </label>
            <input 
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc",{required:true})}
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
           </div>

           {
            !view && (
              <div className="flex justify-end">
                <IconBtn
                  disabled={loading}
                  text={loading ? "Loading..." : edit ? "Save Changes" : "Save"}/>
              </div>
            )
           }
        </form>
      </div>
    </div>
  )
}