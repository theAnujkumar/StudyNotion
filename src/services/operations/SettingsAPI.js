import { toast } from "react-hot-toast"

import {setLoading,setUser} from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token,formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        //dispatch(setLoading(true));

        try{
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    authorization : `Bearer ${token}`
                }
            )
            console.log(
                "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
                response
            )
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success(true);
            dispatch(setUser(response.data.data));
        }
        catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export async function changePassword(token,formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST",CHANGE_PASSWORD_API,formData,
                {
                    authorization : `Bearer ${token}`
                }
            )
            console.log("CHANGE_PASSWORD_API RESPONSE............",
                response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("password change successfully");
        }
        catch (error) {
            console.log(" CHANGE_PASSWORD_API ERROR............", error)
            toast.error(error.response.data.message);
        }
        toast.dismiss(toastId)
    }
}

export async function updateProfile(token,formData) {
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("PUT",UPDATE_PROFILE_API,formData,
                {
                    authorization : `Bearer ${token}`
                }
            )
            console.log("UPDATE_PROFILE_API RESPONSE............",
                response)
            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            const userImage = response.data.updatedUserDetails.image
            ? response.data.updatedUserDetails.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            dispatch(setUser({ ...response.data.updatedUserDetails, image: userImage }))

            toast.success("profile change successfully");
        
        }

        catch (error) {
            console.log(" UPDATE_PROFILE_API ERROR............", error)
            toast.error(error.response.data.message);
        }
        toast.dismiss(toastId);
    }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    }
    
    catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Delete Profile")
    }
    toast.dismiss(toastId)
  }
}

/*
| Step | Action                           | Description                     |
| ---- | -------------------------------- | ------------------------------- |
| 1    | Show loading toast               | “Loading…” message              |
| 2    | `dispatch(setLoading(true))`     | Redux state me loading flag set |
| 3    | API call (with token & formData) | Image upload request            |
| 4    | Response check                   | Backend ke success flag verify  |
| 5    | Update Redux user data           | `dispatch(setUser(...))`        |
| 6    | Handle errors                    | Show toast & log error          |
| 7    | Dismiss loading toast            | Cleanup after completion        |


User selects new photo →
  updateDisplayPicture() →
    show toast + setLoading(true)
    ↓
    call backend API with formData
    ↓
  backend updates image & returns new user data
    ↓
  dispatch(setUser(newUserData))
    ↓
  toast.success("Updated successfully")

*/