import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Request from "../models/Request"; 

import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";


const createRequest = async (req, res, next) => {
    try {
        console.log(req.body); 
        const upload = uploadPicture.single('postPicture');
        upload(req, res, async function (err) {
            if (err) {
                const error = new Error("An unknown error occured when uploading " + err.message);
                next(error);
                return;
            } else {
                const request = new Request({
                    title: req.body.title || "sample title",
                    brand: req.body.brand || "sample brand",
                    series: req.body.series || "sample series",
                    model: req.body.model || "sample model",
                    produced: req.body.produced || "sample production year",
                    color: req.body.color || "sample color",
                    price: req.body.price || 0,
                    likecount: req.body.likecount || 0,
                    slug: req.body.slug || uuidv4(),
                    detail: req.body.detail || {},
                    photo: req.file ? req.file.filename : "",
                    user: req.user._id,
                    status: req.body.status === "approved" || req.body.status === "rejected" ? req.body.status : "waiting",
                    tags: req.body.tags || [],
                    categories: req.body.categories || [],
                });

                const createdRequest = await request.save();
                return res.json(createdRequest);
            }
        });
    } catch (error) {
        next(error);
    }
};



const deleterequest = async (req, res, next) => {
    try {
        const request = await Request.findOneAndDelete({ slug: req.params.slug });

        if (!request) {
            const error = new Error("Request was not found");
            error.statusCode = 404; // Set a specific status code for not found
            throw error; // Throw the error to be caught by the error handling middleware
        }

        return res.json({
            message: "Request is successfully deleted",
        });
    } catch (error) {
        next(error);
    }
};


const getRequest = async (req, res, next) => {
    try {
        const request = await Request.findOne({ slug: req.params.slug }).populate([
            {
                path: "user",
                select: ["avatar", "name"],
            }
        ]);

        if (!request) {
            const error = new Error("request was not found");
            return next(error);
        }

        return res.json(request);
    } catch (error) {
        next(error);
    }
};

const getAllrequests = async (req, res, next) => {
    try {
        const requests = await Request.find({}).populate([
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
        ]);

        res.json(requests);
    } catch (error) {
        next(error);
    }
};

const updateRequestStatus = async (req, res, next) => {
    try {
        // You can validate the new status here if needed
        const newStatus = req.body.status;
        const slug = req.params.slug;

        // Update the status
        const updatedRequest = await Request.findOneAndUpdate(
            { slug },
            { status: newStatus },
            { new: true, runValidators: true }
        );

        if (!updatedRequest) {
            const error = new Error("Request was not found");
            error.statusCode = 404; // Set a specific status code for not found
            throw error; // Throw the error to be caught by the error handling middleware
        }

        return res.json(updatedRequest);
    } catch (error) {
        next(error);
    }
};

const getrequestByUserId = async (req, res, next) => {
    try {
        const requests = await Request.find({ user: req.params.userId }).populate([
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
        ]);

        res.json(requests);
    } catch (error) {
        next(error);
    }
};

export { createRequest, deleterequest, getRequest, getAllrequests, getrequestByUserId,updateRequestStatus};