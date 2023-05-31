import React from 'react'
import MainLayout from '../../components/MainLayout'
const AboutPage = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-orange-600 flex flex-col justify-center items-center">
        <h1 className="text-5xl text-white mb-5">About Our Watch Collection</h1>
        <p className="text-white max-w-lg text-center">
          We at <strong>WatchCollection</strong> are passionate about watches.
          With a wide range of selections, from the vintage classics to the
          modern masterpieces, we strive to cater to all watch enthusiasts. Our
          goal is to provide our customers with an unrivaled choice of
          timepieces, incredible value, and exceptional customer service.
        </p>
        <div className="flex flex-wrap justify-center items-center mt-5">
        </div>
      </div>
    </MainLayout>
  );
}

export default AboutPage