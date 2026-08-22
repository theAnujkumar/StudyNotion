import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
    const {total,totalItems} = useSelector((state) => state.cart);

    return(
        <div className="text-white">
            <h1>Your Cart</h1>
            <p>{totalItems} Courses in Cart</p>

            {
                total > 0 
                ? (
                    <div>
                        <RenderCartCourses/>
                        <RenderTotalAmount/>
                    </div>
                ) :
                (
                    <div>
                        Your Cart is empty
                    </div>
                )
            }
        </div>
    )
}