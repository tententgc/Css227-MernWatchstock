import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import collection from "../collection/Collection";
import { images, stables } from "../../constants";
const AdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false); // State variable for controlling the edit modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account");
        const user_id = JSON.parse(account)._id;
        console.log("account", account);
        const response = await axios.get(
          `${BaseUrl}/api/posts/`
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (slug) => {
    // Show the edit modal
    setShowEditModal(true);
  };

  const handleDelete = async (slug) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;

      await axios.delete(`${BaseUrl}/api/posts/useritem/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.slug !== slug));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">All collection</h1>

        </div>
        {posts.map((post) => (
          <div
            key={post._id}
            className="flex items-center justify-between p-4 bg-white rounded shadow-lg"
          >
            <div className="flex items-center">
              <img
                className="w-20 h-20 mr-4 rounded"
                src={
                  post.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                    : images.samplePostImage
                }
                alt="post"
              />
              <h2 className="text-xl">{post.title}</h2>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => handleDelete(post.slug)}
                className="px-3 py-2 text-white bg-red-500 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </MainLayout>
  );
};

export default AdminPage;
