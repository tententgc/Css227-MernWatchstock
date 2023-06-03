import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import { v4 as uuidv4 } from "uuid";
import BASEURL from "../../data/Baseurl";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Container, Grid, TextField, Input, Button } from "@mui/material";

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
  const navigate = useNavigate(); 

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

      await axios.post(`${BASEURL}/api/requests`, formData, config);
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
      navigate("/request"); 
    } catch (err) {
      toast.error(err.response.data.message); 
      console.error(err);
    }
  };
  return (
    <MainLayout>
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                placeholder="Series"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                placeholder="Produced"
                value={produced}
                onChange={(e) => setProduced(e.target.value)}
                fullWidth
                variant="outlined"
              />
              <TextField
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                placeholder="Detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                fullWidth
                variant="outlined"
                sx={{ mt: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  textTransform: "none",
                  mt: 2,
                  width: "100%",
                  color: "#fff",
                  backgroundColor: "#f97316",
                  "&:hover": { backgroundColor: "#ea580c" },
                }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </MainLayout>
  );
};

export default CreateCollection;
