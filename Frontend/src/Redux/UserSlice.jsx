import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { baseUrl } from "../config";

export const RegisterUser = createAsyncThunk(
  'auth/register',
  async (formData, thunkApi) => {
    try {
      const res = await fetch(baseUrl+'/User/Register', {
        method: "POST",
        credentials: 'include',
        body: formData
      });

      if (!res.ok) throw new Error('Registration failed');
      return true;

    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
    

  }
);


export const LoginUser = createAsyncThunk(
     'auth/login',
     async(formData,thunkApi)=>{
        try{
            const res = await fetch(baseUrl+'/User/Login',{
                method: "Post",
                credentials: 'include',
                body:formData
            }           
            )
             
            if(!res.ok)throw new Error('Login failed');

         return true;
        }
        catch(error){
           return  thunkApi.rejectWithValue(error.message)
        }

     }

)


export const LogoutUser = createAsyncThunk(
  'user/logout',
  async(_,thunkApi)=>
  {

    try{

      var res = await fetch(baseUrl+"/User/Logout",
        {
          credentials:"include"
        }

      )

      if(res.ok){
        clearUserData();
      }


    }
    catch(error){

    }


  }
)






export const GetUserData = createAsyncThunk(
   'user/data',
    async(_,thunkApi)=>
    {
      try{
        console.log("Thunk get User Data works")
      const res = await fetch(baseUrl+`/User`,{
       method: "GET",
       credentials: "include",
       headers: { "Content-Type": "application/json" },
       
      })
      if(!res.ok) throw new Error('Get user data failed')
      
      
      
      return await res.json()
      
      
    }
    catch(error){
     return thunkApi.rejectWithValue(error.message)
     }
   }
  
)


export const GetUserDataByName = createAsyncThunk(
   'user/dataByName',
   async(name,thunkApi)=>{
    
    try{
    
     const res = await fetch(baseUrl+`/User/Profile/`+name,{
      credentials:"include",
      headers: { "Content-Type": "application/json" },
          
     })
     if(!res.ok) throw new Error('Get user data by id failed')

      console.log(res.payload)

     return await res.json()

    }
    catch(error){   
      thunkApi.rejectWithValue(error.message)
    }
   }


)










const UserSlice = createSlice({
  name: 'User',
  initialState: {
    userData: null,
   authorized: false,
   error: null,
   loading: false,
   isLoaded:false,
   userLink:""

  },
  reducers: {
     setUserData:(state,action)=>{
      state.userData = action.payload
      state.authorized = true;
     },
     clearUserData:(state)=>{
      state.userData = null
      state.authorized = false;

      
      
      
     }

  },
  extraReducers: (builder) => {
    builder
      .addCase(RegisterUser.pending, (state) => {
        state.error = null;
        console.log("Register started")
      })
      .addCase(RegisterUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        console.log("Register sucsess")
      })
      .addCase(RegisterUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(LoginUser.fulfilled,(state,action)=>{
        state.authorized = true;
        GetUserData()
      })
      .addCase(GetUserData.pending,(state)=>{
        console.log("Getting user data started")
        state.loading = true;
      })
      .addCase(GetUserData.fulfilled,(state,action)=>{
        state.userData = action.payload;
        state.userLink = "/UserProfile/"+state.userData.user.name
        console.log(state.userData)
        state.authorized = true;
        state.loading = false;
        state.isLoaded = true;
        console.log("getting user data completed")
      })
      .addCase(GetUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoaded = true;
        console.log("Error", action.payload);
      })
      .addCase(GetUserDataByName.pending,(state)=>{
        state.loading = true
        state.isLoaded = false
        console.log(GetUserDataByName.name)
        
      })
      .addCase(GetUserDataByName.fulfilled,(state)=>{
        state.loading = false
        state.isLoaded = true


      })
      .addCase(LogoutUser.fulfilled,(state)=>{
        state.userData = null;
        state.authorized = false;
      })
      
  }
});

export default UserSlice.reducer;
export const { setUserData, clearUserData } = UserSlice.actions;

