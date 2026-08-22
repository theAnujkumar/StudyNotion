import React from "react"
import ContactUsForm from "../ContactPage/ContactUsForm"

const ContactFormSection = () => {
  return(
    <div className="mx-auto">
      <h1 className="text-center text-4xl font-semibold">Get in Touch</h1>
      <p className="text-center text-richblack-300 mt-3">
        We&apos;d love to here for you, Please fill out this form.
      </p>
      <div className="mt-12 mx-auto border-richblack-25 text-richblack-300 
        rounded-xl border p-5 lg:p-12">
        <ContactUsForm />
      </div>
    </div>
  )
}

/*
border-richblack-25 text-richblack-300 rounded-xl
*/
export default ContactFormSection