import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Container,
  TextField,
  TextareaAutosize,
  Input,
  Grid,
  Typography,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom"; 

import ArrowBack from "@mui/icons-material/ArrowBack"
import BASEURL from "../../data/Baseurl";


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

      await axios.post(`${BASEURL}/api/posts`, formData, config);
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
      navigate("/admin");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <MainLayout>
      <Container
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // Updated property
          justifyContent: "flex-start", // Updated property
          padding: "0 16px", // Optional: Add padding to adjust the spacing
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => navigate("/admin")}
          sx={{ mt: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography
          variant="h4"
          component="h1"
          align="left"
          gutterBottom
          style={{ color: "#ea580c", fontWeight: "bold" }}
        >
          Create Collection 
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Name"
                placeholder="Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Brand"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="number"
                label="Price"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Tags"
                placeholder="Tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Series"
                placeholder="Series"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Model"
                placeholder="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Produced"
                placeholder="Produced"
                value={produced}
                onChange={(e) => setProduced(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
              <TextField
                type="text"
                label="Color"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detail"
                placeholder="Detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                sx={{ marginBottom: 2 }}
              />
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                fullWidth
                variant="outlined"
                sx={{ mt: 2, marginBottom: 2 }}
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
