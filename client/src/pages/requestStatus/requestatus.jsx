import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import { images, stables } from "../../constants";
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  IconButton,
  Modal,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = localStorage.getItem("account");
        const user_id = JSON.parse(account)._id;
        const token = JSON.parse(account).token;
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${BaseUrl}/api/requests`, config);
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

  const handleStatusChange = async (slug, status, post) => {
    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      //    console.log("photo",post.photo)
      await axios.patch(
        `${BaseUrl}/api/requests/status/${slug}`,
        { status },
        config
      );
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
      <div className="p-4 h-full min-h-screen">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
          <Typography variant="h4" component="div" gutterBottom>
            All User Request Status
          </Typography>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-wrap">
            <Button variant="contained" href="/createrequest">
              Create Request
            </Button>
            <Button variant="contained" href="/admin">
              Admin Dashboard
            </Button>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post._id}>
                  <TableCell component="th" scope="row">
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <img
                          className="w-20 h-20 mr-4 rounded"
                          src={
                            post.photo
                              ? stables.UPLOAD_FOLDER_BASE_URL + post.photo
                              : images.samplePostImage
                          }
                          alt="post"
                        />
                      </Grid>
                      <Grid item>
                        <span>{post.title}</span>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        handleStatusChange(post.slug, "approved", post)
                      }
                      color="primary"
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleStatusChange(post.slug, "rejected")}
                      color="secondary"
                    >
                      <CancelIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(post.slug)}
                      color="secondary"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenModal(post)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isModalOpen && modalData && (
          <Modal
            open={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setModalData(null);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: isMobile ? "90%" : 800,
                bgcolor: "background.paper",
                border: "2px solid #ea580c",
                boxShadow: 24,
                p: 4,
                display: "flex", // Add display flex
                flexDirection: "row", // Make it horizontal flex container
                justifyContent: "space-between",
              }}
            >
              {modalData && (
                <>
                  <div
                    style={{
                      width: isMobile ? "100%" : "40%",
                      marginRight: isMobile ? "0px" : "20px",
                    }}
                  >
                    {modalData.photo && (
                      <img
                        src={
                          modalData?.photo
                            ? stables.UPLOAD_FOLDER_BASE_URL + modalData?.photo
                            : images.samplePostImage
                        }
                        alt={modalData.title}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          marginTop: "10px",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ width: isMobile ? "100%" : "60%" }}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="div"
                      style={{ color: "#ea580c", fontWeight: "bold" }}
                    >
                      {modalData.title}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                      <strong>Brand:</strong> {modalData.brand} <br />
                      <strong>Series:</strong> {modalData.series} <br />
                      <strong>Model:</strong> {modalData.model} <br />
                      <strong>Produced:</strong> {modalData.produced} <br />
                      <strong>Color:</strong> {modalData.color} <br />
                      <strong>Price:</strong> {modalData.price} <br />
                      <strong>Details:</strong>{" "}
                      {JSON.stringify(modalData.detail)} <br />
                      <strong>Status:</strong> {modalData.status} <br />
                      <strong>Tags:</strong> {modalData.tags.join(", ")} <br />
                    
                    </Typography>
                    <Button
                      onClick={() => {
                        setIsModalOpen(false);
                        setModalData(null);
                      }}
                      color="secondary"
                      variant="contained"
                      style={{
                        backgroundColor: "#ea580c",
                        color: "#fff",
                        fontWeight: "bold",
                        marginTop: "20px",
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </Box>
          </Modal>
        )}
      </div>
    </MainLayout>
  );
};

export default ListPage;
