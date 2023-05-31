import express from "express";
const router = express.Router();
import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
  getPostByUserId, 
} from "../controllers/postControllers";
import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/").post(authGuard,createPost).get(getAllPosts);
router.route("/user/:userId").get(getPostByUserId); 
router.route("/:slug").get(getPost); 
router
  .route("/useritem/:slug")
  .put(authGuard, updatePost) 
  .delete(authGuard, deletePost)
  .get(getPost);

router.route("/admin/:slug")
.put(authGuard, adminGuard, updatePost)
.delete(authGuard, adminGuard, deletePost)
.get(getPost);  

export default router;
