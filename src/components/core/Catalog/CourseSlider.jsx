import React from "react"

import { Swiper, SwiperSlide } from "swiper/react"
// import { FreeMode, Pagination } from 'swiper/modules';
import { FreeMode, Pagination } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Course_Card from "./Course_Card";

const CourseSlider = ({Courses}) => {
  return(
    <div>
     {Courses?.length? (
      <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={Courses.length > 3}
          modules={[FreeMode, Pagination]}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem] pb-8"
      >
          {Courses.map((course) => (
            <SwiperSlide key={course._id}>
              <Course_Card course={course} Height={"h-[250px]"}/>
            </SwiperSlide>
          ))}
      </Swiper>
     ) : 
     (
      <p className="text-xl text-richblack-5">No Course Found</p>
     )}
    </div>
  )
}

export default CourseSlider