import express from "express";
const router = express.Router();
import {
    createCollection,
    getcollectionByUserId,
    getAllcollections,
    getCollection,
    deletecollection
} from "../controllers/CollectionControllers";

import { authGuard, adminGuard } from "../middleware/authMiddleware";

router.route("/").post(authGuard, createCollection);
router.route("/user/:userId").get(authGuard, getcollectionByUserId);
router.route("/").get(authGuard, getAllcollections);
router.route("/:slug")
    .get(authGuard, getCollection)
    .delete(authGuard, deletecollection);

export default router; 