import { useState } from "react"
import { useDispatch,useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getPasswordResetToken } from "../services/operations/authAPI";

const ForgotPassword = () => {

    const[email,setEmail] = useState("");
    const[emailSent , setEmailSent] = useState(false);
    const {loading} = useSelector( (state) => state.auth);
    const dispatch = useDispatch();
    
    const handleOnSubmit = (e) => {
        e.preventDefault();
        dispatch(getPasswordResetToken(email,setEmailSent));
    }

    return(
        <div className="justify-center items-center mx-auto">
            {
                loading ? (
                    <div>
                        Loading ...
                    </div>
                )   :
                (
                    <div>
                        <h1>
                            {
                                !emailSent ? "Reset your password" : "Check Your Email"
                            }
                        </h1>

                        <p>
                            {
                                !emailSent ? "have no fear" : `we have sent email to ${email}`
                            }
                        </p>

                        <form onSubmit={handleOnSubmit}>
                            {
                                !emailSent && (
                                    <label>
                                        <p>Email adress</p>
                                        <input 
                                        type="email"
                                        required="true"
                                        name="email"
                                        value={email}
                                        placeholder="Enter your email"
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-6 bg-richblack-600 text-richblack-5"
                                         />
                                    </label>
                                )
                            }

                            <button type="submit"
                            className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
                            >
                                {
                                    !emailSent ? "reset password" : "resend email"
                                }
                            </button>
                        </form>

                        <div>
                            <Link to="/login">
                                <p>back to login</p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default ForgotPassword