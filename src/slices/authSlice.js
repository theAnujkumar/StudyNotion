// createSlice Redux Toolkit ka helper hai — yeh state, reducers, aur actions 
// ek hi jagah define karne deta hai.

import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    signupData : null,
    loading : false,
    token : localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

const authSlice = createSlice({
    name : "auth",
    initialState : initialState,
    reducers : {
        setToken(state,value) {
            state.token = value.payload;
        },
        setSignupData(state,value) {
            state.signupData = value.payload;
        },
        setLoading(state,value) {
            state.loading = value.payload;
        }
    },
})

export const {setSignupData , setLoading , setToken} = authSlice.actions;
export default authSlice.reducer;

/*
| Concept          | Explanation                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| `createSlice()`  | Ek hi file me state + reducers + actions define karne ka tarika                        |
| `state`          | Data jo Redux store me hai                                                             |
| `action.payload` | Data jo dispatch ke sath aata hai                                                      |
| `Immer`          | Redux Toolkit automatically "mutating syntax" allow karta hai (e.g., `state.step = 2`) |
    action.payload === value
*/