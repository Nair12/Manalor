import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetUserData } from "../Redux/UserSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../Components/Loader";
import { baseUrl } from "../config";

import "../css/Gallery.css"
import "../css/Profile.css"

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData, authorized, isLoaded } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(GetUserData());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!authorized) {
      navigate("/Login", {
        state: { message: "Please sign in before accessing your profile." },
      });
    }
  }, [authorized, isLoaded, navigate]);

  
  if (!isLoaded || !authorized || !userData || !userData.user) return <Loader />;

  const { name, email, avatar } = userData.user;
  const images = userData.images;

  return (
    <div style={{padding:"2rem"}}>

<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
  <div style={{ padding: "20px", width: "300px", textAlign: "center" }}>
    <h1>{name}</h1>
    {avatar && (
      <img
        src={`data:image/jpeg;base64,${avatar}`}
        alt="Avatar"
        style={{ width: "150px", borderRadius: "50%", marginBottom: "10px" }}
      />
    )}
    <p>Email: {email}</p>
    <button
      className="btn add"
      onClick={() => navigate("/Upload")}
      style={{ width: "200px", marginTop: "10px" }}
    >
      Add Image
    </button>
  </div>
</div>

<h1 style={{textAlign:"center",marginTop:"100px"}}>{name} gallery</h1>

<div className="userImage" style={{ paddingTop: "30px", columnCount: "6", columnGap: "10px", marginTop: "150px" }}>
  
  {images?.length > 0 && (
    <div style={{ marginTop: "20px" }}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={baseUrl+`/Image/${img.guid}`}
          alt={`img-${idx}`}
          style={{ width: "100%", marginBottom: "15px", borderRadius: "10px", display: "block",cursor:"pointer" }}
          onClick={() => navigate("/Details/" + img.guid)}
          onMouseEnter={()=>{}}

        />
         
      ))}
      
    </div>
  )}
</div>

    </div>
  );
}

export default Profile;
