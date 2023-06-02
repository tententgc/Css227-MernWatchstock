import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Collection from "../models/Collection";

import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";


const createCollection = async (req, res, next) => {
    try {
        const upload = uploadPicture.single('postPicture');
        upload(req, res, async function (err) {
            if (err) {
                const error = new Error("An unknown error occured when uploading " + err.message);
                next(error);
                return;
            } else {
                const collection = new Collection({
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
                    photo: req.file ? req.file.filename : "" || req.body.photo,
                    user: req.user._id,
                    tags: req.body.tags || [],
                    categories: req.body.categories || [],
                });

                const createdCollection = await collection.save();
                return res.json(createdCollection);
            }
        });
    } catch (error) {
        next(error);
    }
};



const deletecollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOneAndDelete({ slug: req.params.slug });

        if (!collection) {
            const error = new Error("Collection was not found");
            error.statusCode = 404; // Set a specific status code for not found
            throw error; // Throw the error to be caught by the error handling middleware
        }

        return res.json({
            message: "Collection is successfully deleted",
        });
    } catch (error) {
        next(error);
    }
};


const getCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({ slug: req.params.slug }).populate([
            {
                path: "user",
                select: ["avatar", "name"],
            }
        ]);

        if (!collection) {
            const error = new Error("collection was not found");
            return next(error);
        }

        return res.json(collection);
    } catch (error) {
        next(error);
    }
};

const getAllcollections = async (req, res, next) => {
    try {
        const collections = await Collection.find({}).populate([
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
        ]);

        res.json(collections);
    } catch (error) {
        next(error);
    }
};

const getcollectionByUserId = async (req, res, next) => {
    try {
        const collections = await Collection.find({ user: req.params.userId }).populate([
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
        ]);

        res.json(collections);
    } catch (error) {
        next(error);
    }
};

export { createCollection, deletecollection, getCollection, getAllcollections, getcollectionByUserId };