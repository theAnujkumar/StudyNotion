import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { addCourseDetails, editCourseDetails, fetchCourseCategories } from "../../../../../services/operations/courseDetailsAPI";
//import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import IconBtn from "../../../../common/IconBtn"
import toast from "react-hot-toast";
import RequirementField from "./RequirementField";
import Upload from "../Upload";

import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants";
import ChipInput from "./ChipInput";

export default function CourseInformationForm() {

    const {
        register,
        setValue,
        getValues,
        handleSubmit,
        formState : {errors} ,
    } = useForm()

    const dispatch = useDispatch();
    const {token} = useSelector((state) => state.auth);
    const {course,editCourse} = useSelector((state) => state.course);
    const[loading,setLoading] = useState(false);
    const [courseCategories,setCourseCategories] = useState([]);

    useEffect( () => {
        const getCategories = async () => {
        try {
            setLoading(true);

            const categories = await fetchCourseCategories();
            console.log("categories",categories);

            if(categories?.length > 0)
            {
                setCourseCategories(categories);
            }

        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
        };
        // agar course edit form me hai toh
        // course ki chize backend ki hai .backend se data form me automatically aa jayenga
        // if(editCourse && course)
        if(editCourse)
        {
            console.log("details are " ,editCourse);

            // left part frontend and right backend
            setValue("courseTitle", course.courseName);
            setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag ?? [])
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        /*
        Database
            │
            ▼
        course object
            │
            ▼
        setValue()
            │
            ▼
        React Hook Form
            │
            ▼
        Form Automatically Filled
        */
        getCategories()
    },[editCourse,course,setValue]);
    // [editCourse,course,setValue]

    useEffect(() => {
    console.log("courseCategories state:", courseCategories);
    }, [courseCategories]);

    const isFormUpdated = () => {
        const currentValues = getValues()
        const currentTags = currentValues.courseTags ?? course.tag ?? []
        console.log("changes after editing form values:",currentValues);

        if(currentValues.courseTitle !== course.courseName ||
            currentValues.courseShortDesc !== course.courseDescription ||
            currentValues.coursePrice !== course.price ||
            currentTags.toString() !== (course.tag ?? []).toString() ||
            currentValues.courseBenefits !== course.whatYouWillLearn ||
            currentValues.courseCategory._id !== course.category._id ||
            currentValues.courseRequirements.toString() !==
                course.instructions.toString() 
             || currentValues.courseImage !== course.thumbnail
        ) 
        {
            return true;
        }
        else{
            return false;
        }

    }

    const onSubmit = async(data) => {
        if(editCourse)
        {
            if(isFormUpdated())
            {
                // frontend part ki hai currentValues
                const currentValues = getValues();
                const currentTags = currentValues.courseTags ?? course.tag ?? []
                const formData = new FormData()

                formData.append("courseId" , course._id);
                if(currentValues.courseTitle !== course.courseName)
                {
                    formData.append("courseName" , data.courseTitle);
                }
                if(currentValues.courseShortDesc !== course.courseDescription)
                {
                    formData.append("courseDescription" , data.courseShortDesc);
                }
                if(currentValues.coursePrice !== course.price)
                {
                    formData.append("coursePrice" , data.coursePrice);
                }
                if (currentTags.toString() !== (course.tag ?? []).toString()) {
                formData.append("tag", JSON.stringify(data.courseTags ?? []))
                }
                if (currentValues.courseBenefits !== course.whatYouWillLearn) {
                formData.append("whatYouWillLearn", data.courseBenefits)
                }
                if (currentValues.courseCategory._id !== course.category._id) {
                formData.append("category", data.courseCategory)
                }
                if (
                currentValues.courseRequirements.toString() !==
                course.instructions.toString()
                ) {
                formData.append(
                    "instructions",
                    JSON.stringify(data.courseRequirements)
                )
                }
                if (currentValues.courseImage !== course.thumbnail) {
                formData.append("thumbnailImage", data.courseImage)
                }
                        

                console.log("formdata" , formData);

                setLoading(true);
                const result = await editCourseDetails(formData,token);
                setLoading(false);
                if(result)
                {
                    dispatch(setStep(2));
                    dispatch(setCourse(result));
                }
                else{
                    toast.error("No changes made to the form")
                }
            }
            return ;
        }

        // create new course
        const formData = new FormData()
        // left backend right frontend
        // ye saraa data backend me save ho jayenga
        formData.append("courseName",data.courseTitle);
        formData.append("courseDescription",data.courseShortDesc);
        formData.append("price",data.coursePrice);
        formData.append("tag", JSON.stringify(data.courseTags ?? []))
        formData.append("whatYouWillLearn", data.courseBenefits)
        formData.append("category", data.courseCategory)
        formData.append("status", COURSE_STATUS.DRAFT)
        formData.append("instructions", JSON.stringify(data.courseRequirements))
        formData.append("thumbnailImage", data.courseImage)

        console.log("formdata" , formData.get("courseName"));

        setLoading(true);
        const result = await addCourseDetails(formData,token);
        setLoading(false);
        if(result)
            {
            dispatch(setStep(2));
            dispatch(setCourse(result));
            }
        else{
            toast.error("No changes made to the form")
        }
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)} 
            className="rounded-md border-richblack-700 bg-richblack-800 p-6 space-y-8" >

                {/* course title */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" htmlFor="courseTitle">
                    Course Title <sup className="text-pink-200">*</sup>
                    </label>
                    <input 
                        type="text"
                        id="courseTitle"
                        placeholder="Enter Course Title"
                        {...register("courseTitle",{required:true})}
                        className="form-style w-full"
                    />
                    {
                        errors.courseTitle && (
                            <span className="ml-2 text-xs tracking-wide text-pink-200">
                            Course title is required
                            </span>
                        )
                    }
                </div>

                {/* courseShortDesc */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" 
                    htmlFor="courseShortDesc">Course Description <sup className="text-pink-200">*</sup>
                    </label>
                    <textarea 
                        id="courseShortDesc"
                        placeholder="Enter Course Description"
                        {...register("courseShortDesc",{required:true})}
                        className=" w-full form-style"
                    />
                    {
                        errors.courseShortDesc && (
                            <span>
                                Enter course Description
                            </span>
                        )
                    }
                </div>

                {/* courseprice */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" 
                    htmlFor="coursePrice">coursePrice <sup className="text-pink-200">*</sup>
                    </label>
                    <input 
                        type="text"
                        id="coursePrice"
                        placeholder="Enter Course Price"
                        {...register("coursePrice",{required:true})}
                        className="w-full form-style"
                    />
                    {
                        errors.coursePrice && (
                            <span>
                                Enter course Price
                            </span>
                        )
                    }
                </div>

                    {/* coursecategory */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" 
                    htmlFor="courseCategory">courseCategory <sup className="text-pink-200">*</sup>
                    </label>
                        <select
                            type="text"
                            id="courseCategory"
                            defaultValue=""
                            placeholder="Enter Course Category"
                            {...register("courseCategory",{required:true})}
                            className="w-full form-style">

                            <option value="" disabled>
                                choose category
                            </option>
                            {
                                !loading && courseCategories?.map((category,index) => (
                                    <option key={index} value={category?._id}>
                                        {category?.name}
                                    </option>
                                ))
                            }
                        </select>
                    {
                        errors.courseCategory && (
                            <span>
                                course Category required
                            </span>
                        )
                    }
                </div>
                
                {/* create custom component for handling tag component */}
                <ChipInput
                    label = "Tags"
                    name = "courseTags"
                    placeholder = "Enter courseTag"
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    getValues={getValues}
                />
                
                 {/* create custom component for showing and uploading preview of media */}
                 <Upload
                    name="courseImage"
                    label="Course thumbnail"
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    getValues={getValues}
                    editData={editCourse ? course?.thumbnail : null}
                />

                {/* benefits of courses */}
                <div className="flex flex-col space-y-2">
                    <label className="text-sm text-richblack-5" 
                    htmlFor="courseBenefits">Benefits of Courses</label>
                    <textarea
                        id="courseBenefits"
                        placeholder="Enter Benefits of Course"
                            {...register("courseBenefits",{required:true})}
                            className="w-full form-style"
                    />
                    {
                        errors.courseBenefits && (
                            <span>
                                Enter course Benefits
                            </span>
                        )
                    }
                </div>

                {/* Requirement field */}
                <RequirementField
                    name="courseRequirements"
                    label="Requiments/Label"
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    getValues={getValues}
                />

                    {/* next button */}
                <div className="flex justify-between gap-x-2">
                    {
                        editCourse && (
                            <button
                                onClick={() => dispatch(setStep(2))}
                                disabled = {loading} 
                                className={`flex cursor-pointer items-center gap-x-2 rounded-md
                                 bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
                                Continue Without Saving
                            </button>
                        )
                    }
                    {/* icon button next and save changes ka */}
                    <IconBtn 
                        disabled = {loading} 
                        text = {!editCourse ? "Next" : "Save changes"} >
                            <MdNavigateNext />
                    </IconBtn>
                </div>

        </form>
    )
}