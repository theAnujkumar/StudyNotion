import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const {total,totalItems} = useSelector((state) => state.cart);

    return(
        <div className="w-full text-richblack-5">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold sm:text-3xl">Your Cart</h1>
                </div>
                <p className="text-sm text-richblack-300 sm:text-base">
                    {totalItems} {totalItems === 1 ? "Course" : "Courses"} in Cart
                </p>
            </div>

            {
                total > 0 
                ? (
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
                        <div className="flex-1">
                            <RenderCartCourses/>
                        </div>
                        <div className="w-full xl:max-w-[320px]">
                            <RenderTotalAmount/>
                        </div>
                    </div>
                ) :
                (
                    <div className="grid min-h-[200px] place-items-center rounded-xl border border-dashed border-richblack-600 bg-richblack-800 p-6 text-center text-richblack-300">
                        Your Cart is empty
                    </div>
                )
            }
        </div>
    )
}