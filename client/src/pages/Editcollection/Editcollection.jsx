import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import collection from "../collection/Collection";
import { images, stables } from "../../constants";
const ListPage = () => {
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
          `${BaseUrl}/api/posts/user/${user_id}`
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
          <h1 className="text-2xl font-bold">Your collection</h1>
          <Link
            to="/createcollection"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Create Collection
          </Link>
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
                onClick={() => handleEdit(post.slug)}
                className="px-3 py-2 mr-2 text-white bg-blue-500 rounded"
              >
                Edit
              </button>
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

      {showEditModal && (
        // The modal component for editing
        // You can replace the code below with your own modal component
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4">
            <h1>Edit Modal</h1>
            {/* Add your form or content for editing here */}
            <button
              onClick={() => setShowEditModal(false)}
              className="px-3 py-2 text-white bg-blue-500 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ListPage;
