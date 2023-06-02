import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { generateHTML } from "@tiptap/html";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import parse from "html-react-parser";

import BreadCrumbs from "../../components/BreadCrumbs";
import CommentsContainer from "../../components/comments/CommentsContainer";
import MainLayout from "../../components/MainLayout";
import { images, stables } from "../../constants";
import { useQuery } from "@tanstack/react-query";
import { getAllPosts, getSinglePost } from "../../services/index/posts";
import ArticleDetailSkeleton from "./components/ArticleDetailSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import { useSelector } from "react-redux";

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const userState = useSelector((state) => state.user);
  const [breadCrumbsData, setbreadCrumbsData] = useState([]);
  const [body, setBody] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getSinglePost({ slug }),
    queryKey: ["blog", slug],
    onSuccess: (data) => {
      setbreadCrumbsData([
        { name: "Home", link: "/" },
        { name: "item", link: "/feed" },
        { name: "Details collection", link: `/feed/${data.slug}` },
      ]);
      setBody(
        parse(
          generateHTML(data?.body, [Bold, Italic, Text, Paragraph, Document])
        )
      );
    },
  });

  const { data: postsData } = useQuery({
    queryFn: () => getAllPosts(),
    queryKey: ["posts"],
  });

  return (
    <MainLayout>
      {isLoading ? (
        <ArticleDetailSkeleton />
      ) : isError ? (
        <ErrorMessage message="Couldn't fetch the post detail" />
      ) : (
        <section className="container mx-auto max-w-5xl px-5 py-5">
          <div className="flex flex-col lg:flex-row lg:gap-x-5">
            <div className="lg:w-1/2">
              <img
                className="rounded-xl w-full h-96 object-cover"
                src={
                  data?.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + data?.photo
                    : images.samplePostImage
                }
                alt={data?.title}
              />
            </div>
            <div className="lg:w-1/2">
              <BreadCrumbs data={breadCrumbsData} />
              <h1 className="text-2xl font-medium font-roboto mt-4 text-dark-hard md:text-3xl">
                {data?.title}
              </h1>
              <div className="mt-4 flex gap-2">
                {data?.categories.map((category) => (
                  <Link
                    to={`/blog?category=${category.name}`}
                    className="text-primary text-sm font-roboto inline-block md:text-base"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <div className="mt-4 prose prose-sm sm:prose-base">{body}</div>

              {/* Additional Information */}
              <div className="mt-4">
                <h2 className="text-lg font-medium font-roboto text-orange-600">
                  <strong>Additional Information</strong>
                </h2>
                <ul className="mt-2">
                  <li>
                    <strong>Brand:</strong> {data?.brand}
                  </li>
                  <li>
                    <strong>Series:</strong> {data?.series}
                  </li>
                  <li>
                    <strong>Model:</strong> {data?.model}
                  </li>
                  <li>
                    <strong>Produced:</strong> {data?.produced}
                  </li>
                  <li>
                    <strong>Color:</strong> {data?.color}
                  </li>
                  <li>
                    <strong>Price:</strong> {data?.price}
                  </li>
                  <li>
                    <strong>Details:</strong> {data?.details}
                  </li>
                  <li>
                    <strong>Status:</strong> {data?.status}
                  </li>
                  <li>
                    <strong>Tags:</strong> {data?.tags}
                  </li>
                  <li>
                    <strong>Categories:</strong> {data?.categories}
                  </li>
                </ul>
              </div>

              {/* Add to My Collection Button */}
              <div className="mt-4">
                <button className="bg-orange-600 text-white font-medium py-2 px-4 rounded-lg">
                  Add to my collection
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default ArticleDetailPage;
