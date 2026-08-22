import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { removeFromCart } from "../../../../slices/cartSlice";

export default function RenderCartCourses()  {

    const {cart} = useSelector((state) => state.cart);
    const {dispatch} = useDispatch();

    return(
        <div>
            {
                cart.map((course,index) => {
                    <div>
                        {/* image and text */}
                        <div>
                            <img src={course?.thumbnail}/>
                            <div>
                                <p>{course?.courseName}</p>
                                <p>{course?.category?.name}</p>
                                <div>
                                    <span>4.8</span>
                                    <ReactStars
                                        count={5}
                                        size={20}
                                        edit={false}
                                        emptyIcon={<i className="far fa-star"></i>}
                                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                                        fullIcon={<i className="fa fa-star"></i>}
                                        activeColor="#ffd700"/>
                                    <span>Rating</span>
                                </div>
                            </div>
                        </div>

                        {/* remove cart button*/}
                        <div>
                            <button
                            // remove from cart with course_.id
                                onClick={() => dispatch(removeFromCart(course._id))}> 
                                <RiDeleteBin6Fill />
                                <span>Remove</span>
                            </button>
                            <p>{course?.price}</p>
                        </div>
                    </div>
                })
            }
        </div>
    )
}