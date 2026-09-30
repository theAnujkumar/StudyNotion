import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";

export default function VideoDetailsSidebar({ setReviewModal })
{
  const[activeStatus,setActiveStatus] = useState("")
  const[videoBarActive,setVideoBarActive] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const {sectionId , subSectionId} = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    const updateActiveVideo = () => {
      if (!courseSectionData?.length) return;
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );

      if (currentSectionIndx === -1) return;

      const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection?.findIndex(
        (data) => data._id === subSectionId
      );

      const activeSubSectionId = courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]?._id;
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    };

    updateActiveVideo();
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subSectionId]);

  return(
    <>
      <div className="flex h-auto w-full flex-col border-b border-r-0 border-richblack-700 bg-richblack-800 lg:h-[calc(100vh-3.5rem)] lg:w-[320px] lg:max-w-[350px] lg:border-b-0 lg:border-r">
        {/* upper part till courses */}
        <div className="mx-4 flex flex-col items-start justify-between gap-3 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25 sm:mx-5">
          {/* button */}
          <div className="flex w-full items-center justify-between gap-3">
            {/* back button */}
            <div
              onClick={() => navigate(`/dashboard/enrolled-courses`)}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 transition-transform hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>

            {/* add review */}
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
          </div>

          <div className="flex flex-col">
            <p className="break-words text-base sm:text-lg">{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* lectures part */}
        <div className="max-h-[60vh] overflow-y-auto lg:max-h-[calc(100vh-12rem)]">
          {/* to understand assume course as section */}
          {courseSectionData.map((course, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              key={index}
            >
              {/* sections */}
              <div
                className="flex flex-row items-center justify-between bg-richblack-600 px-4 py-4 sm:px-5"
                onClick={() => setActiveStatus(activeStatus === course?._id ? "" : course?._id)}
              >
                <div className="w-[70%] font-semibold">
                  {course?.sectionName}
                </div>

                <span
                  className={`${
                    activeStatus === course?._id ? "rotate-0" : "rotate-180"
                  } transition-all duration-500`}
                >
                  <BsChevronDown />
                </span>
              </div>

              {/* subsections */}
              {activeStatus === course?._id && (
                <div className="bg-richblack-800">
                  {course.subSection.map((topic, i) => (
                    <div
                      className={`flex gap-3 px-4 py-3 sm:px-5 ${
                        videoBarActive === topic._id
                          ? "bg-yellow-200 font-semibold text-richblack-800"
                          : "hover:bg-richblack-900"
                      }`}
                      key={i}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        );
                        setVideoBarActive(topic._id);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 accent-yellow-50"
                      />
                      <span className="break-words">{topic.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}