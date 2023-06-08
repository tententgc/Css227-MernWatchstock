import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  Modal
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility"; 

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortType, setSortType] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          `${BaseUrl}/api/requests/user/${user_id}`,
          config
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    switch (sortType) {
      case "AZ":
        setPosts([...posts].sort((a, b) => a.title.localeCompare(b.title)));
        break;
      case "ZA":
        setPosts([...posts].sort((a, b) => b.title.localeCompare(a.title)));
        break;
      case "newest":
        setPosts(
          [...posts].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        break;
      case "oldest":
        setPosts(
          [...posts].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
        break;
      default:
        setPosts(
          [...posts].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
        );
        break;
    }
  }, [sortType]);

  const handleOpenModal = (post) => {
    setModalData(post);
    setIsModalOpen(true);
  };

  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((post) => (statusFilter ? post.status === statusFilter : true));

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
  //... above code here...
  //... above code here...

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                style={{ color: "#ea580c", fontWeight: "bold" }}
              >
                All Yours Requests
              </Typography>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-wrap">
                <Button
                  variant="contained"
                  onClick={() => navigate("/createrequest")}
                  sx={{
                    color: "#fff",
                    borderColor: "#f97316",
                    backgroundColor: "#f97316",
                    "&:hover": {
                      backgroundColor: "#fff",
                      color: "#f97316",
                      borderColor: "#fff",
                    },
                  }}
                >
                  Create New Request
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              variant="outlined"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Filter by Status</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Select
              variant="outlined"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="AZ">A-Z</MenuItem>
              <MenuItem value="ZA">Z-A</MenuItem>
              <MenuItem value="newest">Date New-Old</MenuItem>
              <MenuItem value="oldest">Date Old-New</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: isMobile ? 300 : 650 }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPosts.map((post) => (
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
                          style={{
                            color:
                              post.status === "approved"
                                ? "green"
                                : post.status === "rejected"
                                ? "red"
                                : "gray",
                          }}
                        >
                          {post.status}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleOpenModal(post)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(post.slug)}
                          color="secondary"
                        >
                          <DeleteIcon />
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

                    justifyContent: "space-between",
                    overflow: "auto", // Add this line
                    maxHeight: "90%",
                    flexDirection: isMobile ? "column" : "row",
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
                                ? stables.UPLOAD_FOLDER_BASE_URL +
                                  modalData?.photo
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
                          <strong>Tags:</strong> {modalData.tags.join(", ")}{" "}
                          <br />
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
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default ListPage;
