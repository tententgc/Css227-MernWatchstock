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
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

export default router;
