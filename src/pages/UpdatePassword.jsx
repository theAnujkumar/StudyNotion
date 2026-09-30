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
                    <div className="mx-auto max-w-[500px] px-4 py-8 sm:px-6">
                        <h1 className="text-2xl font-bold text-richblack-5">Choose new password</h1>
                        <p className="mt-2 text-richblack-200">Almost done. Enter your new password.</p>

                        <form onSubmit={handleOnSubmit} className="mt-6 space-y-5">
                            <label className="block">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <div className="relative">
                                    <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={handleOnChange}
                                    placeholder="Enter new password"
                                    className="w-full rounded-md border border-richblack-600 bg-richblack-600 p-4 text-richblack-5 outline-none focus:border-yellow-50"/>
                                    <span
                                      onClick={() => setShowPassword((prev) => !prev)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    >
                                        {showPassword ? (
                                        <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                        ) : (
                                        <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                        )}
                                    </span>
                                </div>
                            </label>

                            <label className="block">
                                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                                Confirm New Password <sup className="text-pink-200">*</sup>
                                </p>
                                <div className="relative">
                                    <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleOnChange}
                                    placeholder="Confirm password"
                                    className="w-full rounded-md border border-richblack-600 bg-richblack-600 p-4 text-richblack-5 outline-none focus:border-yellow-50"/>
                                    <span
                                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                                    >
                                        {
                                            showConfirmPassword ? (
                                                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                                                ) : (
                                                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                                                )
                                        }
                                    </span>
                                </div>
                            </label>

                            <button type="submit"
                                className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                            >Reset Password</button>
                        </form>
                        <div className="mt-4 text-center">
                            <Link to="/login">
                            <p className="text-richblack-300">Back to login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default UpdatePassword;