import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";

export default function RenderCartCourses()  {

    const {cart} = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    return(
        <div className="space-y-4">
            {
                cart.map((course, index) => (
                    <div
                        key={course?._id || index}
                        className="flex flex-col gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        {/* image and text */}
                        <div className="flex items-center gap-4">
                            <img
                                src={course?.thumbnail}
                                alt={course?.courseName}
                                className="h-20 w-20 rounded-lg object-cover sm:h-24 sm:w-24"
                            />
                            <div className="min-w-0">
                                <p className="text-lg font-semibold text-richblack-5">{course?.courseName}</p>
                                <p className="text-sm text-richblack-300">{course?.category?.name}</p>
                                <div className="mt-2 flex items-center gap-2 text-sm text-richblack-200">
                                    <span>4.8</span>
                                    <ReactStars
                                        count={5}
                                        size={16}
                                        edit={false}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        fullIcon={<i className="fa fa-star"></i>}
                                        activeColor="#ffd700"
                                    />
                                    <span>Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* remove button and price */}
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                            <button
                            // remove from cart with course_.id
                                type="button"
                                onClick={() => dispatch(removeFromCart(course._id))}
                                className="flex items-center gap-2 rounded-md border border-richblack-600 px-3 py-2 text-sm font-medium text-richblack-300 transition hover:bg-richblack-700 hover:text-richblack-5"
                            >
                                <RiDeleteBin6Fill className="text-base" />
                                <span>Remove</span>
                            </button>
                            <p className="text-lg font-semibold text-yellow-25">Rs {course?.price}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}