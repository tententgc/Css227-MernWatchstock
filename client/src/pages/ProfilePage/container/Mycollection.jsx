import React, { useState } from "react";
import axios from "axios"; 

import ArticleCard from "../../../components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../../components/ArticleCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import BASEURL from "../../../data/Baseurl";
const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPosts = async () => {
    try {
      const account = localStorage.getItem("account");
      const user_id = JSON.parse(account)._id;
      const token = JSON.parse(account).token;
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {};

      const response = await axios.get(
        `${BASEURL}/api/users/getuserposts/${user_id}`,
        config
      );
      console.log("response data",response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

const {
  data: { posts = [] } = {},
  isLoading,
  isError,
} = useQuery({
  queryFn: fetchPosts,
  queryKey: ["posts"],
  onError: (error) => {
    toast.error(error.message);
    console.log(error);
  },
});


const filteredData = posts.filter((post) =>
  post.title.toLowerCase().includes(searchQuery.toLowerCase())
);


  return (
    <section className="flex flex-col container mx-auto px-5 py-10 bg-primary-300">
      <div className="flex flex-col items-center justify-center space-y-5 mt-5">
        <h1 className="text-4xl font-bold text-center text-black">
          My Collection
        </h1>
      </div>

      <div className="flex justify-center mt-10">
        <input
          type="text"
          placeholder="Search by Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-lg w-full md:w-1/2"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {isLoading ? (
          [...Array(3)].map((item, index) => (
            <ArticleCardSkeleton
              key={index}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        ) : isError ? (
          <ErrorMessage message="Couldn't fetch the posts data" />
        ) : filteredData.length === 0 ? (
          <p className="text-center text-white">No Collection found.</p>
        ) : (
          filteredData.map((post) => (
            <ArticleCard
              key={post._id}
              post={post}
              className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Articles;