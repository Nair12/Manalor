import { configureStore } from "@reduxjs/toolkit";
import  UserReducer  from "./UserSlice";
import ImageReducer from "./ImageSlice"



export const store = configureStore({
   
    reducer:{
        user: UserReducer,
        image: ImageReducer
    }

})