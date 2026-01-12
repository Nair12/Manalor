import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import "../css/Details.css";
import { CommentImage, DownloadImage, GetImageDeatils, RenameImage } from "../Redux/ImageSlice";
import LikeButton from "../Components/LikeButton";
import Loader from "../Components/Loader";
import CommentItem from "../Components/CommentItem";
import CustomSelect from "../Components/CustomSelect";
import { setImageUpdated } from "../Redux/ImageSlice";
import CommentGrid from "../Components/CommentGrid";

function Details() {


  const { id } = useParams();
  const [imageDetails, setImageDetails] = useState(null)
  const [commentText, setCommentText] = useState("")
  const { authorized } = useSelector((state) => state.user)
  const { imageUpdated } = useSelector((state) => state.image)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const url = import.meta.env.VITE_BASE_URL + '/Image' + "/" + id;
  const downloadUrl = import.meta.env.VITE_BASE_URL + '/Image/Download/' + id;


  useEffect(() => {
    const fetchDetails = async () => {
      const res = await dispatch(GetImageDeatils(id));
      if (GetImageDeatils.fulfilled.match(res)) {
        setImageDetails(res.payload);
      }
    };

    fetchDetails();

    if (imageUpdated) {
      dispatch(setImageUpdated(false))
    }


  }, [dispatch, id, imageUpdated]);



  const handleCommentClick = async () => {
    if (!authorized) {
      navigate("/Login")
      return
    }

    if (commentText == "") {
      alert("Input comment is empty")
      return
    }




    const res = await dispatch(CommentImage({ imageId: id, text: commentText }))


    setCommentText("")

    if (CommentImage.fulfilled.match(res)) {

      setImageDetails(prevData => ({
        ...prevData,
        comments: [res.payload, ...prevData.comments]
      }))

    }



  }

  const handleDownload = async () => {
    const res = await fetch(downloadUrl);
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = imageDetails?.name || 'image.jpg';
    link.click();
  }


  const handleRename = async () => {
    await dispatch(RenameImage(new (imageDetails.id, newName)))
  }




  console.log("Image details" + JSON.stringify(imageDetails))

  if (imageDetails == null) {
    return (
      <Loader />
    )
  }

  return (

    <div className="image-details" style={{ padding: "4em" }}>
       

      <div className="image-info">
          {imageDetails.isOwner &&
        <CustomSelect guid={id} /> 
        }
        <h1>{imageDetails?.name}</h1>
        <div className="user-info" style={{ marginRight: "100px" }} >
        

          {imageDetails && <img src={`data:image/jpeg;base64,${imageDetails.userAvatar}`} className="user-avatar" onClick={() => { navigate("/UserProfile/" + imageDetails?.userName) }} style={{ cursor: "pointer" }}></img>}
          {imageDetails && <label >{imageDetails.userName}</label>}
      
          <LikeButton imageId={id} countLike={imageDetails.countLikes} isLiked={imageDetails.isLiked} />

       
        
        </div>
           <div className="image-details-image">
           <img src={url} alt="some pict"></img>  
        </div>
        
      </div>

      
    




      <div className="image-details" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
         <div className="download-button" >
            <button className="btn btn-warning" onClick={handleDownload} >Download🠗</button>
          </div>
        <div className="imageComments" style={{paddingTop: "50px"}}>
          <CommentGrid setComment={setCommentText} commentText={commentText} onSend={handleCommentClick} comments={imageDetails.comments} />
        </div>
      </div>





    </div>








  )
}
export default Details