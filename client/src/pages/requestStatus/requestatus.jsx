import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import { images, stables } from "../../constants";
import { Modal } from "bootstrap";

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account");
        const user_id = JSON.parse(account)._id;
        const token = JSON.parse(account).token;
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `${BaseUrl}/api/requests`,
          config
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

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

      await axios.delete(`${BaseUrl}/api/requests/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.slug !== slug));
    } catch (error) {
      console.log(error);
    }
  };

    const handleOpenModal = (post) => {
      setModalData(post);
      setIsModalOpen(true);
    
    };


   const handleStatusChange = async (slug, status,post) => {
     try {
       const account = localStorage.getItem("account");
       const token = JSON.parse(account).token;

       const config = {
         headers: { Authorization: `Bearer ${token}` },
       };
    //    console.log("photo",post.photo)
       await axios.patch(`${BaseUrl}/api/requests/status/${slug}`, { status }, config);
       if (status === "approved") {
        
         const postPayload = {
           title: post.title,
           brand: post.brand,
           series: post.series,
           model: post.model,
           produced: post.produced,
           color: post.color,
           price: post.price,
           details: post.detail,
           photo: post.photo, 
           status: post.status,
           tags: post.tags,
           categories: post.categories,
         };

         await axios.post(`${BaseUrl}/api/posts`, postPayload, config);
       }

       setPosts(
         posts.map((post) => (post.slug === slug ? { ...post, status } : post))
       );
     } catch (error) {
       console.log(error);
     }
   };
  return (
   <MainLayout>
  <div className="flex flex-col h-full">
    <div className="p-4 flex-grow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All User Request Status</h1>
        <div className="flex justify-end space-x-4">
          <Link
            to="/createrequest"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Create Request
          </Link>
          <Link
            to="/admin"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post._id}>
                <td className="px-6 py-4 whitespace-nowrap">
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
                    <span>{post.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`${
                      post.status === "approved"
                        ? "text-green-500"
                        : post.status === "rejected"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() =>
                        handleStatusChange(post.slug, "approved", post)
                      }
                      className="px-3 py-2 text-white bg-green-500 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(post.slug, "rejected")
                      }
                      className="px-3 py-2 text-white bg-orange-500 rounded"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="px-3 py-2 text-white bg-red-500 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleOpenModal(post)}
                      className="px-3 py-2 text-white bg-orange-600 rounded"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  {isModalOpen && modalData&& (
    <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <img
                className="w-48 h-48 rounded mr-4"
                src={
                  modalData.photo
                    ? stables.UPLOAD_FOLDER_BASE_URL + modalData.photo
                    : images.samplePostImage
                }
                alt="post"
              />
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {modalData.title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <strong>Brand:</strong> {modalData.brand} <br />
                    <strong>Series:</strong> {modalData.series} <br />
                    <strong>Model:</strong> {modalData.model} <br />
                    <strong>Produced:</strong> {modalData.produced} <br />
                    <strong>Color:</strong> {modalData.color} <br />
                    <strong>Price:</strong> {modalData.price} <br />
                    <strong>Details:</strong>{" "}
                    {JSON.stringify(modalData.detail)} <br />
                    <strong>Status:</strong> {modalData.status} <br />
                    <strong>Tags:</strong> {modalData.tags.join(", ")}{" "}
                    <br />
                    <strong>Categories:</strong>{" "}
                    {modalData.categories.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</MainLayout>
);

};

export default ListPage;
