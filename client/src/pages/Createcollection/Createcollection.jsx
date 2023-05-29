import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("caption", caption);
    formData.append("body", body);
    formData.append("tags", tags);
    formData.append("newCategory", newCategory);
    formData.append("postPicture", image);

    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {};

      await axios.post("http://localhost:3001/api/posts", formData, config);
      setTitle("");
      setCaption("");
      setBody("");
      setTags("");
      setNewCategory("");
      setImage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed hover:bg-orange-500  hover:border-orange-600 border-2 border-primary transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePost;
