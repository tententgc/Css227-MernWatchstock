import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "./not-found.gif";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-orange-600">
      <img src={NotFoundImage} alt="Not Found" className="w-ssssssssssss64 h-64 mb-8" />
      <h1 className="text-4xl font-bold text-white mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-white text-lg mb-8">
        The page you're looking for does not exist.
      </p>
      <Link
        to="/"
        className="text-white bg-orange-700 px-4 py-2 rounded hover:bg-orange-800 transition-colors duration-300"
      >
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
