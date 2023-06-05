import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Request from "../models/Request"; 

import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";


const createRequest = async (req, res, next) => {
    try {
        console.log(req.body); 
        const upload = uploadPicture.single('requestPicture');
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
                    status: req.body.status === "approved" || req.body.status === "rejected" ? req.body.status : "pending",
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

const updateRequest = async (req, res, next) => {
    try {
        const request = await Request.findOne({ slug: req.params.slug });

        if (!request) {
            const error = new Error("Request was not found");
            next(error);
            return;
        }

        const upload = uploadPicture.single("requestPicture");

        const handleUpdateRequestData = async (data) => {
            try {
                const parsedData = JSON.parse(data.document);
                const {
                    title,
                    detail,
                    slug,
                    tags,
                    categories,
                    brand,
                    series,
                    model,
                    photo,
                    produced,
                    color,
                    price,
                    likecount
                } = parsedData;

                console.log("before update", request.photo);

                // Check if the new photo file exists
                if (photo && !(await fileExists(photo))) {
                    console.log(`File ${photo} doesn't exist, won't update request.photo.`);
                } else {
                    request.photo = photo || request.photo;
                }

                // Update other properties
                request.title = title || request.title;
                request.slug = slug || request.slug;
                request.detail = detail || request.detail;
                request.tags = tags || request.tags;
                request.categories = categories || request.categories;
                request.brand = brand || request.brand;
                request.series = series || request.series;
                request.model = model || request.model;
                request.produced = produced || request.produced;
                request.color = color || request.color;
                request.price = price || request.price;
                request.likecount = likecount || request.likecount;

                console.log("after update", request.photo);

                const updatedRequest = await request.save();
                return res.json(updatedRequest);
            } catch (error) {
                next(error);
            }
        };

        // Function to check if a file exists
        async function fileExists(filePath) {
            try {
                await fs.access(filePath);
                return true;
            } catch (error) {
                return false;
            }
        }

        upload(req, res, async function (err) {
            if (err) {
                const error = new Error(
                    "An unknown error occurred when uploading: " + err.message
                );
                next(error);
            } else {
                // everything went well
                if (req.file) {
                    let filename = request.photo;
                    if (filename) {
                        fileRemover(filename);
                    }
                    request.photo = req.file.filename;

                    handleUpdateRequestData(req.body);
                } else {
                    console.log("Hi there");
                    handleUpdateRequestData(req.body);
                }
            }
        });
    } catch (error) {
        next(error);
    }
};


export { createRequest, deleterequest, getRequest, getAllrequests, getrequestByUserId,updateRequestStatus, updateRequest};