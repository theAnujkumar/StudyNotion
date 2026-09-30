import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { categories } from "../services/apis";
import { getCatalogPageData } from "../services/operations/pageAndComponentDatas";
import CourseSlider from "../components/core/Catalog/CourseSlider";
import { useSelector } from "react-redux";
import Error from "./Error"
import Course_Card from "../components/core/Catalog/Course_Card";

const createCategorySlug = (name = "") => {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

function Catalog () {
  const { loading } = useSelector((state) => state.profile)
  const {catalogName} = useParams()
  const[catalogPageData,setCatalogPageData] = useState(null)
  const[categoryId,setCategoryId] = useState("")
  const [active, setActive] = useState(1)

  // fetch all categories
  // useEffect(() => {
  //   ;(async () => {
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API)
  //       console.log("FULL RESPONSE => ", res);
  //       console.log("catalogName:", catalogName)
  //       console.log("categories data :", res?.data) 
  //       console.log("categories:", res?.data?.data)
  //       const categoriesData = res?.data?.data;

  //     if (!categoriesData) {
  //       console.log("Categories data not found");
  //       return;
  //     }

  //     const category = categoriesData.find(
  //       (ct) =>
  //         ct.name.split(" ").join("-").toLowerCase() ===
  //         catalogName?.toLowerCase()
  //     );

  //     if (!category) {
  //       console.log("Category not found");
  //       return;
  //     }

  //     setCategoryId(category._id);

  //     } catch (error) {
  //       console.log("Could not fetch Categories.", error)
  //     }
  //   })()
  // }, [catalogName])

  useEffect(() => {
      const getCategories = async() => {
      try{
        const res = await apiConnector("GET",categories.CATEGORIES_API)
        const matchedCategory = res?.data?.data?.find(
          (ct) => createCategorySlug(ct.name) === createCategorySlug(catalogName)
        )

        if (!matchedCategory) {
          setCategoryId("")
          setCatalogPageData({ success: false })
          return
        }

        setCategoryId(matchedCategory._id)
      }
      catch(error)
      {
        console.log("Could not fetch Categories.", error)
      }
    }

    if (catalogName) {
      getCategories()
    }
  },[catalogName])


  // categoryid set karte hi ye triger honga

  // useEffect(() => {
  //   if (categoryId) {
  //     ;(async () => {
  //       try {
  //         const res = await getCatalogPageData(categoryId)
  //         setCatalogPageData(res)
  //       } catch (error) {
  //         console.log(error)
  //       }
  //     })()
  //   }
  // }, [categoryId])

  // if (loading || !catalogPageData) {
  //   return (
  //     <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
  //       <div className="spinner text-white">...loading</div>
  //     </div>
  //   )
  // }
  // if (!loading && !catalogPageData.success) {
  //   return <Error />
  // }

  //console.log("course instructor name",catalogPageData?.data?.mostSellingCourses?.firstName)

  useEffect(() => {
    const getCategoryDetails = async() => {
      try{
        const res = await getCatalogPageData(categoryId)
        setCatalogPageData(res)
      }
      catch(error)
      {
        console.log(error)
      }
    }

    if (categoryId) {
      getCategoryDetails()
    }
  }, [categoryId])

    if ( !catalogPageData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="text-white spinner">...Loading</div>
      </div>
    )
    }

    if (!loading && !catalogPageData.success) {
      return <Error/>
    }

    // console.log("catalogPageData",catalogPageData)
    // console.log("catalogPageData data",catalogPageData?.data)
    // console.log("catalogPageData most selling courses",catalogPageData?.data?.mostSellingCourses)
    //console.log(catalogPageData?.data?.selectedCategory?.courses);
    return(
      <div className="min-h-screen bg-richblack-900 text-richblack-5">
        {/* Hero section */}
        <div className="bg-richblack-800">
          <div className="mx-auto flex min-h-[220px] max-w-maxContentTab flex-col justify-center gap-3 px-4 py-8 sm:min-h-[240px] sm:px-6 lg:max-w-maxContent lg:px-8">
            <p className="text-xs text-richblack-300 sm:text-sm">
              {`Home / Catalog / `}
              <span className="text-yellow-25">
                {catalogPageData?.data?.selectedCategory?.name}
              </span>
            </p>
            <p className="text-2xl font-semibold text-richblack-5 sm:text-3xl lg:text-4xl">
              {catalogPageData?.data?.selectedCategory?.name}
            </p>
            <p className="max-w-3xl text-sm leading-6 text-richblack-200 sm:text-base">
              {catalogPageData?.data?.selectedCategory?.description}
            </p>
          </div>
        </div>

        {/* Section 1 */}
        <div className="mx-auto w-full max-w-maxContentTab px-4 py-8 sm:px-6 sm:py-10 lg:max-w-maxContent lg:py-12">
          <div className="section_heading">Courses to get you started</div>
          <div className="my-4 flex flex-wrap gap-2 border-b border-b-richblack-600 text-sm sm:text-base">
            <p
              className={`cursor-pointer px-3 py-2 sm:px-4 ${
                active === 1
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              }`}
              onClick={() => setActive(1)}
            >
              Most Popular
            </p>

            <p
              className={`cursor-pointer px-3 py-2 sm:px-4 ${
                active === 2
                  ? "border-b border-b-yellow-25 text-yellow-25"
                  : "text-richblack-50"
              }`}
              onClick={() => setActive(2)}
            >
              New
            </p>
          </div>

          <div className="pt-2">
            <CourseSlider 
              Courses={catalogPageData?.data?.selectedCategory?.courses}/>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mx-auto w-full max-w-maxContentTab px-4 py-8 sm:px-6 sm:py-10 lg:max-w-maxContent lg:py-12">
          <div className="section_heading">
            Top courses in {catalogPageData?.data?.selectedCategory?.name}
          </div>
          <div className="pt-4">
            <CourseSlider 
              Courses={catalogPageData?.data?.differentCategory?.courses}/>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mx-auto w-full max-w-maxContentTab px-4 py-8 sm:px-6 sm:py-10 lg:max-w-maxContent lg:py-12">
          <div className="section_heading">Frequently Bought</div>
          <div className="py-6 sm:py-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {catalogPageData?.data?.mostSellingCourses
              ?.slice(0,4)
              .map((course,i) => (
                <Course_Card course={course} key={i} Height={"h-[300px] sm:h-[360px]"}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
}

export default Catalog