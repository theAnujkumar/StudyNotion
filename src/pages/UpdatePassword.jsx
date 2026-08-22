import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const UpdatePassword = () => {
    const [formData ,setFormData] = useState({
        password : "",
        confirmPassword : "",
    })
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();
    const {loading} = useSelector( (state) => state.auth);
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);

    // isme hme form ke data se password mil rha hai

    //console.log("form data is " ,formData);
    const {password,confirmPassword} = formData;

    const handleOnChange = (e) => {
        setFormData( (prevData) => (
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token,navigate));
    }
    return(
        <div>
            {
                loading ? (
                    <div>
                        loading...
                    </div>
                ) :
                (
                    <div>
                        <h1>choose new password</h1>
                        <p>almost done. enter new password</p>

                        <form onSubmit={handleOnSubmit}>
                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="confirm password"
                                className="w-full p-6 bg-richblack-600 text-richblack-5"/>
                                <span onClick={() => setShowPassword((prev) => !prev)}>
                                    {showPassword ? (
                                    <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                    ) : (
                                    <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                    )}
                                </span>
                            </label>

                            <label>
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                Confirm New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder="confirm password"
                                className="w-full p-6 bg-richblack-600 text-richblack-5"/>
                                <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                                    {
                                        showConfirmPassword ? (
                                            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                            ) : (
                                            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                            )
                                    }
                                </span>
                            </label>

                            <button type="submit"
                                className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                            >Reset Password</button>
                        </form>
                        <div>
                            <Link to="/login">
                            <p>Back to login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword;