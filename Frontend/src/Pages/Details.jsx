import { useEffect, useRef, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import "../css/Details.css";
import { CommentImage, DownloadImage, GetImageDeatils, RenameImage } from "../Redux/ImageSlice";
import LikeButton from "../Components/LikeButton";
import Loader from "../Components/Loader";
import CommentItem from "../Components/CommentItem";
import SendButton from "../Components/SendButton";
import { baseUrl } from "../config";
import CustomSelect from "../Components/CustomSelect";
import { setImageUpdated } from "../Redux/ImageSlice";

function Details(){


    const {id} = useParams();
    const [imageDetails,setImageDetails] = useState(null)
    const [commentText,setCommentText] = useState("")
    const {authorized} = useSelector((state)=>state.user)
    const {imageUpdated} = useSelector((state)=>state.image)
    const dispatch = useDispatch();
    const navigate = useNavigate()
 
   const url = baseUrl+'/Image'+"/"+id;
   const downloadUrl = baseUrl+'/Image/Download/'+id;

   
   useEffect(() => {
    const fetchDetails = async () => {
      const res = await dispatch(GetImageDeatils(id));
      if (GetImageDeatils.fulfilled.match(res)) {
        setImageDetails(res.payload);
      }
    };
  
    fetchDetails();

    if(imageUpdated){
      dispatch(setImageUpdated(false))
    }


  }, [dispatch, id, imageUpdated]);
  


  const handleCommentClick = async ()=>{
    if(!authorized){
      navigate("/Login")
      return
    }

    if(commentText == ""){
      alert("Input comment is empty")
      return
    }
    
   


   const res = await dispatch(CommentImage({imageId:id,text:commentText}))
   
  
   setCommentText("")
    
   if(CommentImage.fulfilled.match(res)){

    setImageDetails(prevData=>({
      ...prevData,
      comments:[res.payload,...prevData.comments]
    }))
  
   }
      


  }

  const handleDownload = async ()=>{
    const res = await fetch(downloadUrl);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = imageDetails?.name || 'image.jpg'; 
    link.click();     
  }
  

  const handleRename = async()=>{
      await dispatch(RenameImage(new(imageDetails.id,newName)))
  }




  console.log("Image details"+JSON.stringify(imageDetails))
   
  if(imageDetails == null){
    return(
      <Loader/>
    )
  }

    return(

    <div className="image-details" style={{paddingTop:"1rem"}}>
    
      <div className="image-info">
        <h1>{imageDetails?.name}</h1>
        <div className="user-info" style={{marginRight:"100px"}} >

     {imageDetails && <img src={`data:image/jpeg;base64,${imageDetails.userAvatar}`} className="user-avatar" onClick={()=>{navigate("/UserProfile/"+imageDetails?.userName)}}style={{cursor: "pointer"}}></img>}
     {imageDetails && <label >{imageDetails.userName}</label>}
      <LikeButton imageId={id} countLike={imageDetails.countLikes} isLiked ={imageDetails.isLiked}/>

     </div>
      </div>

     {imageDetails.isOwner && 
      <CustomSelect guid={id}/>
     }

      <div className="download-button">
     <button className="btn btn-warning" onClick={handleDownload} >Download🠗</button>
     </div>



     <div className="image-details-image" style={{display:"flex", flexDirection:"row", gap:"100px",alignItems:"flex-start"}}>
     <img src={url} alt="some pict"></img>
       <div className="imageComments" style={{
     // paddingRight:"400px",
      paddingTop:"50px"

      
       }}>
        
     

        <div className="input-comment" style={
          { 
          display: "flex",
          alignItems: "center",
          gap: "5px",
          marginBottom: "16px",}}>
        <input placeholder="Type your comment here" style={{backgroundColor:"#f0faf4",width:"500px",height:"40px",fontSize:"18px",borderRadius:"15px"}} onChange={(e)=>{setCommentText(e.target.value)}} value={commentText}></input>
        <SendButton onClick={handleCommentClick} input={commentText}/>
        </div>


       {imageDetails.comments.length > 0 && 
        <div className="comments" style=
        {{
           width: "600px",
        maxHeight: "400px",
        overflowY: "auto",
        border: "2px solid #ccc",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#e0e7ff",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        }}>


       
       
    
       {imageDetails.comments.map((item,index)=>{
       
       return(
        <CommentItem Name={item.userName} comment = {item.commentText} userAvatar = {item.userAvatar} date =  {item.createdDate} uId = {item.userId}/>

       )

       })}
   

      </div>
} 

      </div>
     </div>
      
    
      
    
    
     </div>




   



    )
}
export default Details