import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetImages } from "../Redux/ImageSlice";
import "../css/Gallery.css";
import ImageItem from "../Components/ImageItem";
import Loader from "../Components/Loader";
import useScrollEnd from "../Components/Scrole";
import MassonryGrid from "../Components/MassonryGrid";

function Gallery() {
  const dispatch = useDispatch();
  const { images, loading } = useSelector((state) => state.image);

  const [imagesDisplay, setDisplayImages] = useState([]);
  const [lastLoadedDate, setLastLoadedDate] = useState("01.01.2000");
  const [search, setSearch] = useState("");
  const [pictureOver,setOver] = useState(false)


  useEffect(() => {
    if (images.length > 0) {
      setDisplayImages((prev) => {
        const newImages = images.filter(
          (img) => !prev.some((i) => i.guid === img.guid)
        );
        
        if(newImages.length == 0){
          setOver(true)
        }

        return [...prev, ...newImages]; 
      });

      const lastDate = images[images.length - 1].loadedDate;
      setLastLoadedDate(lastDate);
    }
  }, [images]);

  
  useScrollEnd(() => {
    if (!loading) dispatch(GetImages(lastLoadedDate));
  });

  // Поиск
  const handleSearch = (input) => {
    setSearch(input);
    if (input === "") {
      setDisplayImages(images);
    } else {
      setDisplayImages(
        images.filter(
          (item) =>
            item.imageName &&
            item.imageName.toLowerCase().startsWith(input.toLowerCase())
        )
      );
    }
  };


  useEffect(() => {
    dispatch(GetImages(lastLoadedDate));
  }, []);

  
  return (
    <div style={{paddingTop:"3rem"}}>
      <div
        className="gallery-head"
        style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
      >
        <input
          className="search-input"
          style={{ width: "50%", height: "50px",borderRadius:"10px",background:"rgba(239, 228, 228, 0.9)",color:"#000",fontSize:"20px",padding:"2"}}
          placeholder="Search🔍"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <MassonryGrid images={imagesDisplay} baseUrl={import.meta.env.VITE_BASE_URL}/>


      {loading &&!pictureOver&& (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Gallery;
