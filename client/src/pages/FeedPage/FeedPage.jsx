import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

import ArticleCard from "../../components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../../services/index/posts";
import { toast } from "react-hot-toast";
import ArticleCardSkeleton from "../../components/ArticleCardSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import MainLayout from "../../components/MainLayout";

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [brandFilter, setBrandFilter] = useState({});

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
    refetchInterval: 100,
  });

  
  const sortPosts = (a, b) => {
    switch (sortOrder) {
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      case "date-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  };
  
 const filteredData = data
   ?.filter((post) =>
     post.title.toLowerCase().includes(searchQuery.toLowerCase())
   
   )
   .sort(sortPosts);

  return (
    <MainLayout>
      <section className="flex flex-col container mx-auto px-5 py-10 bg-primary-300">
        <div className="flex flex-col items-center justify-center space-y-5 mt-5">
          <h1 className="text-4xl font-bold text-center text-orange-600">
            All Collections 
          </h1>
        </div>

        <div className="flex justify-center mt-10">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-lg w-full md:w-1/2"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-lg shadow-lg ml-4"
          >
            <option value="">Sort by </option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="date-asc">Date Old-New</option>
            <option value="date-desc">Date New-Old</option>
          </select>
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
            <p className="text-center text-white">No Collectionfound.</p>
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
    </MainLayout>
  );
};

export default Articles;