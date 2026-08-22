import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  courseSectionData: [],
  courseEntireData: [],
  completedLectures: [],
  totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
  name: "viewCourse",
  initialState,
  reducers: {
    setCourseSectionData: (state, action) => {
      state.courseSectionData = action.payload
    },
    setEntireCourseData: (state, action) => {
      state.courseEntireData = action.payload
    },
    setTotalNoOfLectures: (state, action) => {
      state.totalNoOfLectures = action.payload
    },
    setCompletedLectures: (state, action) => {
      state.completedLectures = action.payload
    },
    updateCompletedLectures: (state, action) => {
      state.completedLectures = [...state.completedLectures, action.payload]
    },
  },
})

export const {
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedLectures,
  updateCompletedLectures,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer

/*
state.courseSectionData = data;

state.courseSectionData = action.payload;

Matlab:

state.courseSectionData = data;

Before
state = {
    courseSectionData: []
}
    
After
state = {
    courseSectionData: [
        {
            _id: "sec1",
            sectionName: "Introduction"
        },
        {
            _id: "sec2",
            sectionName: "React Basics"
        }
    ]
}
Yaad rakhne ka simple rule
dispatch(setCourseSectionData(value))

⬇️

action.payload === value

Jo bhi value tum dispatch() me pass karte ho, wahi reducer ke
 andar action.payload ban jati hai.
*/