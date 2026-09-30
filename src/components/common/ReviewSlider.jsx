import { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
// Icons
import { FaStar } from "react-icons/fa"
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper"


import { ratingsEndpoints } from "../../services/apis"
import { apiConnector } from "../../services/apiConnector"

const ReviewSlider = () => {
  const[reviews,setReviews] = useState([])
  const truncateWords = 15

  useEffect( () => {
    const getAllRatings = async() => {
      const {data} = await apiConnector("GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      console.log("data of reviews ",data);

      if(data?.success) {
        setReviews(data?.data);
      }
    }
    getAllRatings()
  },[])


  const visibleReviews = Math.max(reviews.length, 1);
  const compactReviews = reviews.length < 3;

  return(
    <div className="text-white">
      {/* <div className="h-[180px] my-[50px] max-w-maxContentTab lg:max-w-maxContent"> */}
      <div className="my-[50px] min-h-[180px] w-full max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          loop={reviews.length > 3}
          centerInsufficientSlides={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            // 700
              640: {
                slidesPerView: Math.min(visibleReviews, 2),
              },
              1024: {
                slidesPerView: Math.min(visibleReviews, 3),
              }
            }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full ">

            {reviews.map((review,i) => {
              return(
                <SwiperSlide key={i}>
                  <div className={`mx-auto flex w-full ${compactReviews ? "max-w-[24rem]" : "max-w-none"} flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25`}>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          review?.user?.image 
                          ? review?.user?.image 
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                        }
                        className="h-9 w-9 rounded-full object-cover"
                        alt="img"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                        <h2 className="text-[12px] font-medium text-richblack-500">
                          {review?.course?.courseName}
                        </h2>
                      </div>
                    </div>

                    <p className="font-medium text-richblack-25">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                    </p>

                    <div className="flex items-center gap-2 ">
                      <h3 className="font-semibold text-yellow-100">
                        {review.rating.toFixed(1)}
                      </h3>
                      <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false}
                        activeColor="#ffd700"
                        emptyIcon={<FaStar />}
                        fullIcon={<FaStar />}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
            {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider