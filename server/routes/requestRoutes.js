import express from "express";
const router = express.Router();
import { 
    createRequest,
    getrequestByUserId,
    getAllrequests,
    getRequest,
    deleterequest,
    updateRequestStatus,
    updateRequest
} from "../controllers/RequestControllers";

import { authGuard, adminGuard } from "../middleware/authMiddleware"; 

router.route("/").post(authGuard,createRequest); 
router.route("/user/:userId").get(authGuard,getrequestByUserId); 
router.route("/").get(authGuard,getAllrequests); 
router.route("/:slug")
.get(authGuard,getRequest)
.delete(authGuard,deleterequest);

router.route("/status/:slug") 
.put(authGuard,adminGuard,updateRequestStatus)
.patch(authGuard,adminGuard,updateRequestStatus); 

router.route("/admin/:slug") 
.patch(authGuard,adminGuard,updateRequest)


export default router; 