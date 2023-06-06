import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-10 h-10 border-4 border-orange-300 border-t-4 border-orange-500 rounded-full animate-spin color-orange-500"></div>
    </div>
  );
};

export default Loading;
