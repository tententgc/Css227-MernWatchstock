import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  addPostToUser,
  deletePostFromUser,
  getUserPosts
} from "../controllers/userControllers";
import { authGuard } from "../middleware/authMiddleware";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfile);
router.put("/updateProfile", authGuard, updateProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);
router.post("/addpost", authGuard, addPostToUser); 
router.delete("/deletepost/:id", authGuard, deletePostFromUser); 
router.get("/getuserposts/:userId", authGuard, getUserPosts);
export default router;
