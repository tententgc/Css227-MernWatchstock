import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";

const createPost = async (req, res, next) => {
  try {
    const upload = uploadPicture.single('postPicture');
    console.log(req.body);
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An unknown error occured when uploading " + err.message);
        next(error);
        return;
      } else {
        const post = new Post({
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

        const createdPost = await post.save();
        return res.json(createdPost);
      }
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }

    const upload = uploadPicture.single("postPicture");

    const handleUpdatePostData = async (data) => {
      try {
        const parsedData = JSON.parse(data.document);
        const { title, detail, slug, tags, categories, brand, series, model,photo, produced, color, price, likecount } = parsedData;

        post.title = title || post.title;
        post.slug = slug || post.slug;
        post.detail = detail || post.detail;
        post.tags = tags || post.tags;
        post.categories = categories || post.categories;
        post.brand = brand || post.brand;
        post.series = series || post.series;
        post.model = model || post.model;
        post.produced = produced || post.produced;
        post.color = color || post.color;
        post.price = price || post.price;
        post.likecount = likecount || post.likecount;
        post.photo = photo || post.photo; 

        const updatedPost = await post.save();
        return res.json(updatedPost);
      } catch (error) {
        next(error);
      }
    };

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred when uploading: " + err.message
        );
        next(error);
      } else {
        // everything went well
        if (req.file) {
          let filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;

          handleUpdatePostData(req.body);
        } else {
          let filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    await Comment.deleteMany({ post: post._id });

    return res.json({
      message: "Post is successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
            populate: [
              {
                path: "user",
                select: ["avatar", "name"],
              },
            ],
          },
        ],
      },
    ]);

    if (!post) {
      const error = new Error("Post was not found");
      return next(error);
    }

    return res.json(post);
  } catch (error) {
    next(error);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({}).populate([
      {
        path: "user",
        select: ["avatar", "name", "verified"],
      },
    ]);

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostByUserId = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).populate([
      {
        path: "user",
        select: ["avatar", "name", "verified"],
      },
    ]);

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export { createPost, updatePost, deletePost, getPost, getAllPosts, getPostByUserId };
