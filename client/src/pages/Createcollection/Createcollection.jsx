import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import { v4 as uuidv4 } from "uuid";

const CreateCollection = () => {
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [series, setSeries] = useState("");
  const [model, setModel] = useState("");
  const [produced, setProduced] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState(0);
  const [likecount, setLikeCount] = useState(0);
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState([]);
  const [slug, setSlug] = useState(uuidv4());

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("brand", brand);
    formData.append("series", series);
    formData.append("model", model);
    formData.append("produced", produced);
    formData.append("color", color);
    formData.append("price", price);
    formData.append("likecount", likecount);
    formData.append("detail", detail);
    formData.append("postPicture", image);
    formData.append("tags", tags);
    formData.append("slug", slug);

    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {};
      console.log(account);

      await axios.post("http://localhost:3001/api/posts", formData, config);
      setTitle("");
      setBrand("");
      setSeries("");
      setModel("");
      setProduced("");
      setColor("");
      setPrice(0);
      setLikeCount(0);
      setDetail("");
      setImage("");
      setTags([]);
      setSlug(uuidv4());
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
          <input
            type="text"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
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
            placeholder="Series"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Produced"
            value={produced}
            onChange={(e) => setProduced(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <textarea
            placeholder="Detail"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
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

export default CreateCollection;
