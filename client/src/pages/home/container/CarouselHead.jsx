import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import images from "../../../constants/images";

const CarouselHead = () => {
  return (
    <div className="carousel-container w-full">
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        showStatus={false}
        showIndicators={false}
        style={{ height: "400px" }}
        className="w-full h-full"
      >
        <div>
          <img
            src={images.Image1Carousel}
            alt="image1"
            className="object-cover w-full h-80 sm:h-96 md:h-120"
          />
        </div>
        <div>
          <img
            src={images.Image2Carousel}
            alt="image2"
            className="object-cover w-full h-80 sm:h-96 md:h-120"
          />
        </div>
        <div>
          <img
            src={images.Image3Carousel}
            alt="image3"
            className="object-cover w-full h-80 sm:h-96 md:h-120"
          />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselHead;
