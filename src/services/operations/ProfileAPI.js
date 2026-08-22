import { toast } from "react-hot-toast"

import {setLoading,setUser} from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints } from "../apis"
import { logout } from "./authAPI"

const { GET_USER_DETAILS_API, 
    GET_USER_ENROLLED_COURSES_API ,
    GET_INSTRUCTOR_DATA_API}
     = profileEndpoints

export async function getUserDetails(token,navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        //console.log("token of getUserDetails ",token);
        try{
            const response = await apiConnector(
                "GET",
                GET_USER_DETAILS_API,
                null,
                {
                    Authorization : `Bearer ${token}`,
                }
            )
            //console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            const userImage = response.data.data.image
            ? response.data.data.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
            dispatch(setUser({ ...response.data.data, image: userImage }))
            }

        catch (error) {
            dispatch(logout(navigate))
            console.log("GET_USER_DETAILS API ERROR............", error)
            toast.error("Could Not Get User Details")
        }
        toast.dismiss(toastId)
        dispatch(setLoading(false))
    }
}

export async function getUserEnrolledCourses(token) {
    const toastId = toast.loading("Loading...");
    let result = [];
    try{
        //console.log("BEFORE Calling BACKEND API FOR ENROLLED COURSES");
        //console.log("token of getUserEnrolledCourses ",token);
        const response = await apiConnector(
            "GET",
            GET_USER_ENROLLED_COURSES_API,
            null,
            {
                Authorization : `Bearer ${token}`,
            }
        )
        // console.log("response of getUserEnrolledCourses in profile.js " , response);
        // console.log("AFTER Calling BACKEND API FOR ENROLLED COURSES");

        if (!response.data.success) {
            throw new Error(response.data.message)
        }
        result = response.data.data;
        //console.log("response.data.data of getUserEnrolledCourses " ,result)
    }
    catch (error) {
        // console.log("ERROR =", error);
        // console.log("ERROR RESPONSE =", error.response);
        // console.log("ERROR DATA =", error.response?.data);
        // console.log("ERROR STATUS =", error.response?.status);
        // toast.error("Could Not Get Enrolled Courses");
        console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
        toast.error("Could Not Get Enrolled Courses")
    }
    toast.dismiss(toastId)
    return result
}
// pending profile

export async function getInstructorData(token)
{
  const toastId = toast.loading("Loading...");
  let result = []; 

  try{
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
    console.log("result of GET_INSTRUCTOR_DATA_API " , result);
  }
  catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}

/*
| Step | Action                            | Purpose                    |
| ---- | --------------------------------- | -------------------------- |
| 1    | Show loading toast                | User feedback              |
| 2    | `dispatch(setLoading(true))`      | Redux me loading flag      |
| 3    | API call with token               | Get user data              |
| 4    | Check response                    | Error handling             |
| 5    | Process user image                | Fallback avatar            |
| 6    | `dispatch(setUser())`             | Save user details in Redux |
| 7    | Catch error                       | Logout + error message     |
| 8    | Dismiss toast + setLoading(false) | Cleanup                    |


*/
