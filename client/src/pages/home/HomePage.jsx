import React from "react";
import MainLayout from "../../components/MainLayout";



import CarouselHead from "./container/CarouselHead";
import Suggest from "./container/Suggest"; 

const HomePage = () => {
  return (
    <MainLayout>
      <div style={{ width: "60%", margin: "0 auto" }}>
        <CarouselHead />
      </div>
      <Suggest /> 
    </MainLayout>
  );
};

export default HomePage;
