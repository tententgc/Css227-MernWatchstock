import React from "react";
import { Link } from "react-router-dom";
import { BsCheckCircle } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";


import { images, stables } from "../constants";

const ArticleCard = ({ post, className }) => {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

return (
  <div
    className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] transform transition-all duration-300 ease-in-out hover:scale-110 ${className}`}
  >
    <Link to={`/item/${post.slug}`}>
      <img
        src={
          post.photo
            ? `${stables.UPLOAD_FOLDER_BASE_URL}${post.photo}`
            : images.samplePostImage
        }
        alt="title"
        className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
      />
    </Link>
    <div className="p-5">
      <Link to={`/item/${post.slug}`}>
        <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">
          {post.title}
        </h2>
        <p className="text-dark-light mt-3 text-sm md:text-lg">
          {post.caption}
        </p>
      </Link>
      <div className="flex justify-between flex-nowrap items-center mt-6">
        <div className="flex items-center gap-x-2 md:gap-x-2.5"></div>
        <span className="font-bold text-dark-light italic text-sm md:text-base">
          {formatDate(post.createdAt)}
        </span>
      </div>
    </div>
  </div>
);

};

export default ArticleCard;
