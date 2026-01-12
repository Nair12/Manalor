import React from 'react';
import Masonry from "react-masonry-css";
import ImageItem from "./ImageItem";

const MassonryGrid = ({ images,baseUrl}) => {
    const breakPoints = {
    default: 7, 
    1200: 5,
    800: 3,
    500: 2
  };

    return (
        <Masonry
            breakpointCols={breakPoints}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {images.map((item) => {
                const url = baseUrl + `/Image/${item.guid}`;
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
    );
}

export default MassonryGrid;
