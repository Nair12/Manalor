import { use, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { GetUserDataByName } from "../Redux/UserSlice";
import Loader from "../Components/Loader";
import { baseUrl } from "../config";
import { CardImgOverlay } from "react-bootstrap";



function AnotherProfile() {

    const { name } = useParams()
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUserData = async () => {

            const res = await dispatch(GetUserDataByName(name))
            console.log("response " + res.payload)


            const userData = res.payload
            console.log("User NAME" + userData.user.name)

            console.log("Owner" + userData.user.owner)


            setUserData(res.payload)


        }

        fetchUserData()


    }, [dispatch, name])

    if (userData == null) {
        return (
            <Loader />
        )
    }

    return (
        <div style={{padding:"2rem"}}>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ padding: "20px", width: "300px", textAlign: "center" }}>
                    <h1>{userData.user.name}</h1>
                    {userData.user.avatar && (
                        <img
                            src={`data:image/jpeg;base64,${userData.user.avatar}`}
                            alt="Avatar"
                            style={{ width: "150px", borderRadius: "50%", marginBottom: "10px" }}
                        />
                    )}
                    <p>Email: {userData.user.email}</p>

                    {userData.user.owner == true &&
                        <button
                            className="btn add"
                            onClick={() => navigate("/Upload")}
                            style={{ width: "200px", marginTop: "10px" }}
                        >
                            Add Image
                        </button>
                    }

                </div>
            </div>
          

            
            <div className="tab-navigation" style={{display:"flex",flexDirection:"row",
                                                  alignContent: "center",justifyContent:"center",
                                                  border: "2px solid #333",
                                                  boxShadow:" 5px 5px 10px rgba(0, 0, 0, 0.4)",
                                                  gap:"15px",borderRadius:"15px",padding:"10px",maxWidth:"600px",margin:"0 auto"}}>
                  <button
                            className="btn add"
                            onClick={() => null}
                            style={{ width: "200px", marginTop: "10px" }}
                        >
                            Gallery
                        </button>

                     <button
                            className="btn add"
                            onClick={() => null}
                            style={{ width: "200px", marginTop: "10px" }}
                        >
                            Likes
                        </button>

                       <button
                            className="btn add"
                            onClick={() => null}
                            style={{ width: "200px", marginTop: "10px" }}
                        >
                            Settings
                        </button>

            </div>


            <h1 style={{ textAlign: "center", marginTop: "100px" }}>{userData.user.name} Gallery</h1>

            <div className="userImage" style={{ paddingTop: "30px", columnCount: "6", columnGap: "10px", marginTop: "150px" }}>

                {userData.images?.length > 0 ?(
                    <div style={{ marginTop: "20px" }}>
                        {userData.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={baseUrl + `/Image/${img.guid}`}
                                alt={`img-${idx}`}
                                style={{ width: "100%", marginBottom: "15px", borderRadius: "10px", display: "block"}}
                                onClick={() => navigate("/Details/" + img.guid)}
                                

                            />
                        ))}
                    </div>
                ) : (
                    <div style={{display:"flex",flexDirection:"column",
                                 alignContent: "center", maxWidth:"15rem",maxHeight:"auto",justifyContent:"center"}}>
                        <img src="https://cdn-icons-png.flaticon.com/512/61/61898.png" alt="User does not publish any picture"/>
                        <h1>No Pictures</h1>
                        
                    </div>
                )}

                



            </div>

        </div>



    )











}

export default AnotherProfile