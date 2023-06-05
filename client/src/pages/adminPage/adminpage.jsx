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
  TextField,
  Select,
  InputAdornment,
  MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";


const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [sortedPosts, setSortedPosts] = useState([]);
  const [sortType, setSortType] = useState("");
    const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


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


   useEffect(() => {
     let filteredPosts = posts;
     if (searchTerm) {
       filteredPosts = filteredPosts.filter((post) =>
         post.title.toLowerCase().includes(searchTerm.toLowerCase())
       );
     }
     setSortedPosts(filteredPosts);
   }, [searchTerm, posts]);

 useEffect(() => {
   switch (sortType) {
     case "AZ":
       setSortedPosts(
         [...posts].sort((a, b) => a.title.localeCompare(b.title))
       );
       break;
     case "ZA":
       setSortedPosts(
         [...posts].sort((a, b) => b.title.localeCompare(a.title))
       );
       break;
     case "newest":
       setSortedPosts(
         [...posts].sort(
           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
         )
       );
       break;
     case "oldest":
       setSortedPosts(
         [...posts].sort(
           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
         )
       );
       break;
     default:
       setSortedPosts(posts);
       break;
   }
 }, [sortType, posts]);

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEditModal(true);
  };

  const handleDelete = async (slug) => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this post?"
    );
    console.log(slug); 
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
    }

    delete postData.postPicture;

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

  const handleAccordionClick = (e) => {
    e.preventDefault();
    e.target.classList.toggle("collapsed");
  };

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
            All Collection
          </Typography>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-wrap">
            <Button variant="contained"  onClick={() => navigate("/createcollection")}    sx={{
                color: "#fff",
                borderColor: "#f97316",
                backgroundColor: "#f97316",
                rounded: true,
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#f97316",
                  borderColor: "#fff",
                },
              }}>
              Create New Collection
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
         
                 <Grid item xs={12} sm={6}>
            <Select
              variant="outlined"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="AZ">A-Z</MenuItem>
              <MenuItem value="ZA">Z-A</MenuItem>
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPosts.map((post) => (
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
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEdit(post)}
                      color="primary"
                    >
                      <EditIcon />
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
        {showEditModal && selectedPost && (
          <Modal
            open={showEditModal}
            onClose={() => setShowEditModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ backgroundColor: "white", overflow: "auto" }}
          >
            <Box
              sx={{
                p: 4,
                backgroundColor: "#f8f9fa",
                maxHeight: "100vh",
                overflowY: "auto",
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h2"
                style={{ color: "#ea580c", fontWeight: "bold" }}
              >
                Edit Collection
              </Typography>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdatePost();
                }}
              >
                <div className="flex flex-wrap -mx-3">
                  {[
                    "title",
                    "tags",
                    "brand",
                    "price",
                    "series",
                    "model",
                    "produced",
                    "color",
                    "detail",
                  ].map((name, index) => (
                    <div
                      key={name}
                      className="w-full md:w-1/2 px-3 mb-6 md:mb-0"
                    >
                      <label
                        htmlFor={name}
                        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      >
                        {name.charAt(0).toUpperCase() + name.slice(1)}:
                      </label>
                      <input
                        type={name === "price" ? "number" : "text"}
                        id={name}
                        name={name}
                        value={selectedPost[name]}
                        onChange={handleInputChange}
                        className="appearance-none block w-full bg-gray-100 text-gray-700 border rounded-lg py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:ring-2 focus:ring-ea580c"
                      />
                    </div>
                  ))}
                </div>
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
                    className="mt-1 block border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-2 focus:ring-ea580c"
                  />
                </div>
                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    style={{ backgroundColor: "#ea580c", color: "white" }}
                    startIcon={<SaveIcon />}
                  >
                    Update
                  </Button>
                  <Button
                    onClick={() => setShowEditModal(false)}
                    color="secondary"
                    variant="outlined"
                    style={{ color: "#ea580c", borderColor: "#ea580c" }}
                    startIcon={<CloseIcon />}
                  >
                    Close
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>
        )}
      </Box>
    </MainLayout>
  );
};

export default ListPage;

                  
