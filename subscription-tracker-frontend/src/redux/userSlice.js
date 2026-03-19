import {createSlice} from "@reduxjs/toolkit";

const initialState={user:localStorage.getItem("user") || null};

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        login:(state,action)=>{
            state.user=action.payload;
            localStorage.setItem("user",action.payload);
        },
        logout:(state)=>{
            state.user=null;
            localStorage.removeItem("user");
        }
    }
});

export const {login,logout}=userSlice.actions;
export default userSlice.reducer;