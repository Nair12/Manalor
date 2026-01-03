import { useNavigate } from "react-router-dom"
import "../css/Gallery.css"

function ImageItem(props){
  
   const navigate  = useNavigate();

  return(
  <div className="image-wrapper">
      <img
        src={props.url}
        alt={props.name}
        className="image-item"
        onClick={() => {
          navigate("/Details/" + props.id);
        }}
      />
      <div className="image-overlay" onClick={() => {
          navigate("/Details/" + props.id);
        }}>
        <span className="image-name">{props.name}</span>
      </div>
    </div>
  )



}

export default ImageItem