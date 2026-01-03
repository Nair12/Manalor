import { asyncThunkCreator, createAsyncThunk, createSlice, freeze } from "@reduxjs/toolkit";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";




export const AddImage = createAsyncThunk(
    'image/add',
    async (formData,thunkApi) =>{
        console.log("Thunk AddImage is available")
       try{

       const res = await fetch(baseUrl+'/Image',
       {
        method: "POST",
        credentials: 'include',
        body:formData
       }    
       )
       if(!res.ok) throw new Error("Adding failed") 

       const uri = res.headers.get("Location")
             
       const json = await res.json()
       
      // console.log("json:"json)
        
       return {...json,uri}

    }  
    catch(error)
    { 
        thunkApi.rejectWithValue(error.message)

    }
  
}

)


export const GetImages = createAsyncThunk(
       'images/get',

       
       async (date,thunkApi) =>{

    
        
        try{
        
        const lastLoadedAt = Date.parse(date)
        console.log(lastLoadedAt)
        
           

            const res = await fetch(baseUrl+'/Image/Pagination/'+lastLoadedAt,{
                method: "GET",
                credentials: "include",
              }
    
              )
    
              if(!res.ok){
                throw new Error("Get imaged failed")
              }

           
           // console.log(JSON.stringify(res))
            return res.json();


        }
        catch(error){
            thunkApi.rejectWithValue(error.message)
        }
        
    }

)


export const GetImageDeatils = createAsyncThunk(
       'image/details',

       async(uid,thunkApi) =>{
       try{
        console.log("request started")
        const res = await fetch(baseUrl+'/Image/Details/'+uid,{
            method:"GET",
            credentials:"include"
        }
    
        )
       
       
         if(!res.ok){throw new Error("Getting details failed")}
         
        

         return res.json()

       }
       catch(error){thunkApi.rejectWithValue(error.message)}

       

    }


)


export const DownloadImage  = createAsyncThunk(    
    "image/download",
    async(id,thunkApi) =>{
        try{
            console.log("download started")
            const res = fetch(baseUrl+'/api/Image/Download/'+id)

            if(!res.ok) throw new Error("Download failed")


        }
        catch(error){
            thunkApi.rejectWithValue(error.message)
        }

       

    }



)

export const LikeImage = createAsyncThunk(
      'Image/Like',
      async (imageId,thunkApi)=>{
        try{

            const res = await fetch(baseUrl+'/Image/Like/'+imageId,{
                method:"POST",
                credentials:"include",
            })
            

            if(!res.ok) {throw new Error("Likes failed")}
            
      
            return res.json();

        }
        catch(error){
            thunkApi.rejectWithValue(error.message)
        }

      }


)



export const CommentImage = createAsyncThunk(
     'Image/Comment',
     async ({ imageId, text },thunkApi)=>{
        try{
            const res = await fetch(baseUrl+'/Image/Comment/'+imageId,{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type": "application/json"

                },
                body: JSON.stringify(text)
            })
            
            if(!res.ok) {throw new Error("Likes failed")}
            
      
            return res.json();

        }
        catch(error){
            thunkApi.rejectWithValue(error.message)
        }


  
     }


)


export const RenameImage = createAsyncThunk(
   'Image/Rename',
   async({guid,newNameValue},thunkApi)=>{
         
    const res = await fetch(baseUrl+'/Image/'+guid,{
        method: "PATCH",
        credentials:"include",
         headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(newNameValue)
       
    })

    if(res.ok){
        return res.json()
    }
    else{
        thunkApi.rejectWithValue("Rename failed!")
    }


   }

    )


export const DeleteImage = createAsyncThunk(
    'Image/Delete',
    async(guid,thunkApi)=>{
       const res =  await fetch(baseUrl+'/Image/'+guid,{
            method:"DELETE",
            credentials:"include",
            headers:{
                "Content-Type" : "application/json"
            }

        })
       
        if(res.ok){
             return res
        }     
    }
)





const ImageSlice = createSlice({
    name: 'Image',
    initialState: {

    images: [],
    loading:false,
    imageUpdated:false
       
    },
    reducers: {

       setImage:(state,action)=>{
        state.images = action.payload
       },

       RemovePhoto:(state,action)=>{
        state.images = state.images.filter(photo => photo.guid !== action.payload)
       },

       setImageUpdated:(state,action)=>{
         state.imageUpdated = action.payload
       }


  
    },
    extraReducers: (builder)=>{
        builder
        .addCase(AddImage.pending,(state)=>{
            state.loading = true        
        })
        .addCase(AddImage.fulfilled,(state,action)=>{
            state.images.push(action.payload)
            state.loading = false;
            console.log("Adding end")
            console.log("payload:" + action.payload)
            console.log("state: "+JSON.stringify(state.images))
        })
        .addCase(AddImage.rejected,(state,action)=>{
           state.loading = false;
           console.log(action.payload)

        })
        .addCase(GetImages.pending,(state)=>{
            state.loading = true;
        })
        .addCase(GetImages.fulfilled,(state,action)=>{
            const newImages = action.payload.filter(
           (img) => !state.images.some((i) => i.guid === img.guid)
           );
          state.images = [...state.images, ...newImages];
          state.loading = false;
        })
        .addCase(RenameImage.fulfilled,(state,action)=>{

        })
        
    }
   
    

})
export const { setImage, RemovePhoto, setImageUpdated } = ImageSlice.actions;
export default ImageSlice.reducer;