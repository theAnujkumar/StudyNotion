import {combineReducers} from "@reduxjs/toolkit"
import authReducer from "../../slices/authSlice";
import profileReducer from "../../slices/profileSlice"
import cartReducer from "../../slices/cartSlice"
import viewCourseReduer from "../../slices/viewCourseSlice"
import courseReducer from "../../slices/courseSlice"

// combine all reducer into rootReducer
// and add root reducer in index.js

const rootReducer = combineReducers({
    auth : authReducer,
    profile : profileReducer,
    cart : cartReducer,
    course : courseReducer,
    viewCourse : viewCourseReduer,
})

export default rootReducer

