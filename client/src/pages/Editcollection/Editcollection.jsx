import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../components/MainLayout";
import BaseUrl from "../../data/Baseurl";
import { images, stables } from "../../constants";

import {
  Box,
  Grid,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Modal,
  TableHead,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
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
        const response = await axios.get(
          `${BaseUrl}/api/users/getuserposts/${user_id}`,
          config
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmation) {
      return;
    }

    try {
      const account = localStorage.getItem("account");
      const token = JSON.parse(account).token;

      await axios.delete(`${BaseUrl}/api/users/deletepost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModal = (post) => {
    setModalData(post);
    setIsModalOpen(true);
  };

  return (
   <MainLayout>
      <Box sx={{ flexGrow: 1, p: 2, backgroundColor: '#fff', fontFamily: 'Georgia, serif' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" component="div" gutterBottom style={{ color: '#ea580c', fontWeight: 'bold' }}>
              My Collection
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: isMobile ? 300 : 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: '#ea580c', fontWeight: 'bold'}}>Name</TableCell>
                    <TableCell align="right" style={{ color: '#ea580c', fontWeight: 'bold'}}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post._id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(234, 88, 12, 0.1)' } }}>
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
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleDelete(post._id)}
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
          </Grid>
        </Grid>
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalData(null); // Set modal data back to null when closing the modal
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
              width: isMobile ? "90%" : 400, // Responsive width
              bgcolor: "background.paper",
              border: "2px solid #ea580c",
              boxShadow: 24,
              p: 4,
            }}
          >
            {modalData && ( // Ensure modalData is not null before rendering these components
              <>
                <Typography id="modal-modal-title" variant="h6" component="div" style={{ color: '#ea580c', fontWeight: 'bold' }}>
                  {modalData.title}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <strong>Brand:</strong> {modalData.brand} <br />
                  <strong>Series:</strong> {modalData.series} <br />
                  <strong>Model:</strong> {modalData.model} <br />
                  <strong>Produced:</strong> {modalData.produced} <br />
                  <strong>Color:</strong> {modalData.color} <br />
                  <strong>Price:</strong> {modalData.price} <br />
                  <strong>Details:</strong> {JSON.stringify(modalData.detail)} <br />
                  <strong>Status:</strong> {modalData.status} <br />
                  <strong>Tags:</strong> {modalData.tags.join(", ")} <br />
                  <strong>Categories:</strong> {modalData.categories.join(", ")}
                </Typography>
              </>
            )}
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setModalData(null); // Set modal data back to null when closing the modal
              }}
              color="secondary"
              variant="contained"
              style={{ backgroundColor: '#ea580c', color: '#fff', fontWeight: 'bold', marginTop: '20px' }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
</MainLayout>


  );
};

export default ListPage;




