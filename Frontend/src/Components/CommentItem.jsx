import { useEffect, useState } from "react";
import "../css/Details.css";
import { useNavigate } from "react-router-dom";

function CommentItem(props){


    const [formattedDate,setFormattedDate] = useState("")
    const navigate = useNavigate()
    
    useEffect(()=>{

   
        
       const formattedDate = new Date(props.date).toLocaleString('ru-RU', {
       day: '2-digit',
       month: '2-digit',
       year: 'numeric',
       hour: '2-digit',
       minute: '2-digit',
    });
    setFormattedDate(formattedDate)
        

    },[])
    


 
    return(
    
  <div
    style={{
      paddingTop: "20px",
      display: "flex",
      flexDirection: "row"
    }}
  >
    <div
      className="commentContainer"
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start" 
      }}
    >
      {/* Аватар */}
      <img
        src={`data:image/jpeg;base64,${props.userAvatar}`}
        className="user-avatar"
        style={{ width: "50px", height: "50px", borderRadius: "50%",cursor:"pointer" }}
        alt="avatar"
        onClick={()=>{navigate("/UserProfile/"+props.Name)}}
        
      />

      {/* Контент комментария */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
          <h3 style={{ margin: 0,fontSize:"17px" }}>{props.Name}</h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{formattedDate}</p>
        </div>
        <p style={{ margin: 0 }}>
          <strong>{props.comment}</strong>
        </p>
      </div>
    
    </div>

 


  </div>
  
);


  //  <button><i class="bi bi-trash3-fill"></i></button>



}

export default CommentItem
