import React from "react";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../common/IconBtn";
import { BuyCourse } from "../../../../services/operations/studentFeaturesAPI";
import { useNavigate } from "react-router-dom";

export default function RenderTotalAmount() {

    const {total,cart} = useSelector((state) => state.cart);
    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleBuyCourse = () => {
        const courses = cart.map((course) => course._id);
        //console.log("course are ",course);
        console.log("buying a courses" , courses);
        BuyCourse(token,courses,user,navigate,dispatch)
    }

    return(
        <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-5 text-richblack-5">
            <p className="text-lg font-semibold">Total</p>
            <p className="mt-3 text-3xl font-bold text-yellow-25">Rs {total}</p>

            <IconBtn
                text="Buy Now"
                onclick={handleBuyCourse}
                customClasses={"mt-5 w-full justify-center"}
                type="button"
            />
        </div>
    )

}
