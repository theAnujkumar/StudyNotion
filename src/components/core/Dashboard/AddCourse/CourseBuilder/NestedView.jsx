import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md"
import { AiFillCaretDown } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FaPlus } from "react-icons/fa"
import { RxDropdownMenu } from "react-icons/rx"
import SubSectionModal from "./SubSectionModal"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({handleChangeEditSectionName}) => {

    const{course} = useSelector((state) => state.course);
    const{token} = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const[addSubSection,setAddSubsection] = useState(null);
    const[viewSubSection,setViewSubSection] = useState(null);
    const[editSubSection,setEditSubSection] = useState(null);
    const[confirmationModal,setConfirmationModal] = useState(null);

    // useEffect(() => {
    //   console.log("Rerender it again");
    // });

    const handleDeleteSection = async(sectionId) => {
     const result = await deleteSection({
      sectionId,
      courseId : course._id,
      token,
     })

     if(result)
     {
      dispatch(setCourse(result))
     }
     //editSectionName = true;
     setConfirmationModal(null)
    }

    const handleDeleteSubSection = async(subSectionId,sectionId) => {
     const result = await deleteSubSection({
      subSectionId,
      sectionId,
      token
     })

     if(result)
     {
      // something missing
      // update the structure of course
      const updatedCourseContent = course.courseContent.map((section) => 
        section._id === sectionId ? result : section)

        const updatedCourse = {...course, courseContent:updatedCourseContent}
        dispatch(setCourse(updatedCourse))
     }
     setConfirmationModal(null)
    }

    return(
     <div>
        <div className="space-y-4 rounded-lg border border-richblack-700 bg-richblack-800 p-4 sm:p-6">
         {
            course?.courseContent?.map((section) => (
                <details key={section._id} open className="overflow-hidden rounded-xl border border-richblack-600 bg-richblack-700/80">
                    {/* create section  */}
                  {/* select dropdown menu */}
                    <summary className="flex cursor-pointer items-center justify-between gap-3 px-3 py-3 sm:px-4">
                        <div className="flex items-center gap-x-3 min-w-0">
                            <RxDropdownMenu className="text-2xl text-richblack-50" />
                            <p className="truncate font-semibold text-richblack-50">
                              {section.sectionName}
                            </p>
                        </div>

                        {/* edit and delete button */}
                        <div className="flex items-center gap-x-2 sm:gap-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                handleChangeEditSectionName(section._id, section.sectionName)
                              }}
                              className="rounded-md p-2 transition hover:bg-richblack-600"
                              aria-label="Edit section"
                            >
                              <MdEdit className="text-xl text-richblack-300" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setConfirmationModal({
                                  text1 : "Delete this section",
                                  text2 : "All lectures",
                                  btn1Text : "Delete",
                                  btn2Text : "Cancel",
                                  btn1Handler : () => handleDeleteSection(section._id),
                                  btn2Handler : () => setConfirmationModal(null),
                                })
                              }}
                              className="rounded-md p-2 transition hover:bg-richblack-600"
                              aria-label="Delete section"
                            >
                              <RiDeleteBin6Line className="text-xl text-richblack-300" />
                            </button>
                            <span className="hidden font-medium text-richblack-300 sm:inline">|</span>
                            <AiFillCaretDown className="text-xl text-richblack-300" />
                        </div>
                    </summary>

                    {/* subsections */}
                    <div className="border-t border-richblack-600 px-3 pb-4 pt-3 sm:px-5">
                      {/* Render All Sub Sections Within a Section */}
                      {section?.subSection?.map((data) => (
                        <div
                          key={data?._id}
                          onClick={() => setViewSubSection(data)}
                          className="flex cursor-pointer items-center justify-between gap-3 border-b border-b-richblack-600 py-3 last:border-b-0"
                        >
                          <div className="flex min-w-0 items-center gap-x-2">
                            <RxDropdownMenu className="text-xl text-richblack-50" />
                            <p className="truncate font-medium text-richblack-50">
                              {data.title}
                            </p>
                          </div>

                          {/* edit and delete button */}
                          <div
                            className="flex items-center gap-x-2 sm:gap-x-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => setEditSubSection({ ...data, sectionId: section._id })}
                              className="rounded-md p-2 transition hover:bg-richblack-600"
                              aria-label="Edit lecture"
                            >
                              <MdEdit className="text-xl text-richblack-300" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setConfirmationModal({
                                  text1 : "Delete this subsection ?",
                                  text2 : "This lecture will be deleted",
                                  btn1Text : "Delete",
                                  btn2Text : "Cancel",
                                  btn1Handler : () => handleDeleteSubSection(data._id, section._id),
                                  btn2Handler : () => setConfirmationModal(null),
                                })
                              }}
                              className="rounded-md p-2 transition hover:bg-richblack-600"
                              aria-label="Delete lecture"
                            >
                              <RiDeleteBin6Line className="text-xl text-richblack-300" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add Sub Section Button */}
                      <button
                        type="button"
                        onClick={() => setAddSubsection(section._id)}
                        className="mt-4 flex items-center gap-x-2 rounded-md px-2 py-2 text-sm font-medium text-yellow-50 transition hover:bg-richblack-700"
                      >
                        <FaPlus className="text-base" />
                        <span>Add Lecture</span>
                      </button>
                    </div>
                </details>
            ))
         }
        </div>

        {/* this show modal according subsection select */}
        
        {
          addSubSection ? (<SubSectionModal
            modalData={addSubSection}
            setModalData={setAddSubsection} 
            add={true}
            />):
          viewSubSection ? (<SubSectionModal
            modalData={viewSubSection}
            setModalData={setViewSubSection} 
            view={true}
            />):
          editSubSection ? (<SubSectionModal
            modalData={editSubSection}
            setModalData={setEditSubSection} 
            edit={true}
            />):
          (<div></div>)
        }

        {
          confirmationModal ? 
          (<ConfirmationModal modalData={confirmationModal}/>) :
          (<></>)
        }
       
     </div>
    )
}

export default NestedView