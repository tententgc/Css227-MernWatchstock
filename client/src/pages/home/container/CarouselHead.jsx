import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import images from "../../../constants/images";

const CarouselHead = () => {
  return (
    <div>
      <Carousel showThumbs={false}>
        <div>
          <img
            src={images.Image1Carousel}
            alt="image1"
            style={{ width: "100%", height: "auto" }}
          />
          {/* <p className="legend">Legend 1</p> */}
        </div>
        <div>
          <img
            src={images.Watch}
            alt="image2"
            style={{ width: "100%", height: "auto" }}
          />
          {/* <p className="legend">Legend 2</p> */}
        </div>
        <div>
          <img
            src={images.Contact}
            alt="image3"
            style={{ width: "100%", height: "auto" }}
          />
          {/* <p className="legend">Legend 3</p> */}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselHead;
