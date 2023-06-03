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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const ListPage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
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
        const response = await axios.get(`${BaseUrl}/api/requests/user/${user_id}`, config);
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

  return (
    <MainLayout>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
              <Typography variant="h4" component="div" gutterBottom>
                All yours requests
              </Typography>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-wrap">
                <Button variant="contained" href="/createrequest">
                  Create New Request
                </Button>
              </div>
            </div>
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
          </Grid>
        </Grid>
      </Box>
    </MainLayout>
  );
};

export default ListPage;

