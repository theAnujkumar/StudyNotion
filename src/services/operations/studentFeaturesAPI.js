//import React from "react";
import {apiConnector} from "../apiConnector"
import { studentEndpoints } from "../apis";
import { toast } from "react-hot-toast"
import {setPaymentLoading} from "../../slices/courseSlice"
import { resetCart } from "../../slices/cartSlice";
import rzpLogo from "../../assets/Logo/Logo-Full-Light.png"

const {
    COURSE_PAYMENT_API,
    COURSE_VERIFY_API,
    SEND_PAYMENT_SUCCESS_EMAIL_API
} = studentEndpoints

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// buy course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) 
{
  const toastId = toast.loading("Loading...")
  try{
    // loading script of razorpay
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

      if (!res) {
        toast.error(
          "Razorpay SDK failed to load. Check your Internet Connection."
        )
        return
      }

    // initiate order in backend
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      {
          courses,
      },
      {
          Authorization : `Bearer ${token}`,
      }
    )
    console.log("TOKEN =", token);
    console.log("order response is ",orderResponse)
    console.log("order response data ka data ",orderResponse.data.data)
    if(!orderResponse.data.success)
    {
      throw new Error(orderResponse.data.message)
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    console.log("Razorpay Key =", process.env.REACT_APP_RAZORPAY_KEY);

    // Opening the Razorpay SDK
    const options = {
      key : process.env.REACT_APP_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image : rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler : function(response) {
        sendPaymentSuccessEmail(response,token,orderResponse.data.data.amount)
        verifyPayment({ ...response, courses }, token, navigate, dispatch)
      }
    }
    console.log("options are " , options)
    console.log("window of razorpay",window.Razorpay);
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log("window payment error",response.error)
    })
  }

  catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }

  toast.dismiss(toastId)
  
}

// verify payment
export async function verifyPayment(bodyData,token,navigate,dispatch)
{
  const toastId = toast.loading("Verify Payment...")
  dispatch(setPaymentLoading(true))

  try{
    const response = await apiConnector("POST",COURSE_VERIFY_API,bodyData,
      {
        Authorization : `Bearer ${token}`,
      })

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)
    
    if(!response.data.success)
    {
      throw new Error(response.data.message)
    }
    toast.success("Payment Success . You are addded to the course")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  }

  catch (error) {
    console.log("PAYMENT VERIFY API API ERROR............", error)
    //toast.error(error.message)
    toast.error("Could Not Verify Payment.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

// Send the Payment Success Email
export async function sendPaymentSuccessEmail(response , token , amount)
{
  try{
    const res = await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId : response.razorpay_order_id,
        paymentId : response.razorpay_payment_id,
        amount,
      },
      {
        Authorization : `Bearer ${token}`,
      }
    )
    console.log("response of Payment Success Email is ",res)
  }
  catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
