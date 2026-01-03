import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Masonry from "react-masonry-css"; // 🆕 библиотека
import { GetImages } from "../Redux/ImageSlice";
import "../css/Gallery.css";
import ImageItem from "../Components/ImageItem";
import Loader from "../Components/Loader";
import useScrollEnd from "../Components/Scrole";
import { baseUrl } from "../config";

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

  
  const breakpointColumnsObj = {
    default: 7, 
    1200: 5,
    800: 3,
    500: 2
  };

  return (
    <div style={{paddingTop:"3rem"}}>
      <div
        className="gallery-head"
        style={{ display: "flex", justifyContent: "center", padding: "20px 0" }}
      >
        <input
          className="search-input"
          style={{ width: "500px", height: "50px",borderRadius:"10px" }}
          placeholder="Search🔍"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {imagesDisplay.map((item) => {
          const url = baseUrl+`/Image/${item.guid}`;
          return (
            <ImageItem
              key={item.guid}
              url={url}
              name={item.imageName}
              id={item.guid}
            />
          );
        })}
      </Masonry>

      {loading &&!pictureOver&& (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Loader />
        </div>
      )}
    </div>
  );
}

export default Gallery;
