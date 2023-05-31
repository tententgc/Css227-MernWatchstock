import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import Post from "../models/Post";
import Comment from "../models/Comment";
import { fileRemover } from "../utils/fileRemover";
import { v4 as uuidv4 } from "uuid";


const createPost = async (req, res, next) => {
  try {
    const upload = uploadPicture.single('postPicture');
    console.log(req.body)
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error("An unknown error occured when uploading " + err.message);
        next(error);
        return;
      } else {
        const post = new Post({
          title: req.body.title || "sample title",
          caption: req.body.caption || "sample caption",
          brand: req.body.brand || "sample brand",
          price: req.body.price || 0,
          likecount: req.body.likecount || 0,
          slug: req.body.slug || uuidv4(),
          body: req.body.body || {
            type: "doc",
            content: [],
          },
          photo: req.file ? req.file.filename : "",
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
        const { title, caption, slug, body, tags, categories, brand, price, likecount } = parsedData;

        post.title = title || post.title;
        post.caption = caption || post.caption;
        post.slug = slug || post.slug;
        post.body = body || post.body;
        post.tags = tags || post.tags;
        post.categories = categories || post.categories;
        post.brand = brand || post.brand;
        post.price = price || post.price;
        post.likecount = likecount || post.likecount;

        const updatedPost = await post.save();
        return res.json(updatedPost);
      } catch (error) {
        next(error);
      }
    };


    
    upload(req, res, async function (err) {
      console.log(req.body)
      console.log(req.file)
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
      const error = new Error("Post aws not found");
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
    console.log(req.params.userId)
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

export { createPost, updatePost, deletePost, getPost, getAllPosts ,getPostByUserId };
