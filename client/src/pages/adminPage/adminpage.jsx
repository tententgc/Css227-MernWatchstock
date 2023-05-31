import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import { images, stables } from "../../constants";

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account");
        const user_id = JSON.parse(account)._id;
        const response = await axios.get(`${BaseUrl}/api/posts/`);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (post) => {
    setSelectedPost(post);
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

      await axios.delete(`${BaseUrl}/api/posts/admin/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.slug !== slug));
    } catch (error) {
      console.log(error);
    }
  };

const handleUpdatePost = async () => {
  try {
    const account = localStorage.getItem("account");
    const token = JSON.parse(account).token;

    const formData = new FormData();
    const postData = { ...selectedPost };
    if (postData.postPicture && postData.postPicture[0]) {
      formData.append("postPicture", postData.postPicture[0]);
      delete postData.postPicture;
    }

    // The remaining properties of selectedPost are appended as a JSON string under the key 'document'
    formData.append("document", JSON.stringify(postData));

    const response = await axios.patch(
      `${BaseUrl}/api/posts/admin/${selectedPost.slug}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.slug === selectedPost.slug ? response.data : post
      )
    );
    setShowEditModal(false);
  } catch (error) {
    console.log(error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPost((prevSelectedPost) => ({
      ...prevSelectedPost,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedPost((prevSelectedPost) => ({
      ...prevSelectedPost,
      postPicture: [file],
    }));
  };

  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">All collection</h1>
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
                onClick={() => handleEdit(post)}
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
      {showEditModal && selectedPost && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-4 rounded">
            <h1 className="text-2xl font-bold mb-4 text-center">Edit Post</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePost();
              }}
              className="space-y-4"
            >
              {[
                "title",
                "caption",
                "body",
                "tags",
                "categories",
                "brand",
                "price",
              ].map((name) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}:
                  </label>
                  <input
                    type={name === "price" ? "number" : "text"}
                    id={name}
                    name={name}
                    value={selectedPost[name]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="postPicture"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo:
                </label>
                <input
                  type="file"
                  id="postPicture"
                  name="postPicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block border-gray-300 rounded-md shadow-sm sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-orange-600 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-white bg-orange-600 rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ListPage;

