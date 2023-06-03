import { uploadPicture } from "../middleware/uploadPictureMiddleware";
import User from "../models/User";
import Post from "../models/Post";
import { fileRemover } from "../utils/fileRemover";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, description } = req.body;

    // check whether the user exists or not
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User have already registered");
    }

    // creating a new user
    user = await User.create({
      name,
      email,
      password,
      description: description || "",
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      description: user.description, 
      verified: user.verified,
      admin: user.admin,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }

    if (await user.comparePassword(password)) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        description: user.description,
        verified: user.verified,
        admin: user.admin,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

const userProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        description : user.description,
        verified: user.verified,
        admin: user.admin,
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (!user) {
      throw new Error("User not found");
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.description = req.body.description || user.description;
    if (req.body.password && req.body.password.length < 6) {
      throw new Error("Password length must be at least 6 character");
    } else if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUserProfile = await user.save();

    res.json({
      _id: updatedUserProfile._id,
      avatar: updatedUserProfile.avatar,
      name: updatedUserProfile.name,
      email: updatedUserProfile.email,
      description : updatedUserProfile.description, 
      verified: updatedUserProfile.verified,
      admin: updatedUserProfile.admin,
      token: await updatedUserProfile.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePicture = async (req, res, next) => {
  try {
    const upload = uploadPicture.single("profilePicture");

    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occured when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          if (filename) {
            fileRemover(filename);
          }
          updatedUser.avatar = req.file.filename;
          await updatedUser.save();
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            description : updatedUser.description,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        } else {
          let filename;
          let updatedUser = await User.findById(req.user._id);
          filename = updatedUser.avatar;
          updatedUser.avatar = "";
          await updatedUser.save();
          fileRemover(filename);
          res.json({
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            description : updatedUser.description,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            token: await updatedUser.generateJWT(),
          });
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addPostToUser = async (req, res) => {
  try {
    // 1. Get the post ID and slug from the request
    const { postId, slug } = req.body;
    console.log("Post ID: ", postId, "Slug: ", slug )
    // 2. Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // 3. Add the post to the user's array of posts
    const user = await User.findById(req.user._id);
    user.posts.push({ _id: postId, slug });
    await user.save();

    // 4. Return success response
    res.json({ message: 'Post added successfully', post });
  } catch (error) {
    // handle error
    res.status(500).json({ error: 'An error occurred while adding post' });
  }
};

// userControllers.js

export const deletePostFromUser = async (req, res) => {
  console.log("Param ID: ", req.params.id, typeof req.params.id);

  try {
    const user = await User.findById(req.user._id)
    console.log("User posts: ", user.posts);

    if (user) {
      // Find the index of the post in the user's posts array
      const removeIndex = user.posts.findIndex((item) => item.toString() === req.params.id);

      // Check if post was found in user's posts array
      if (removeIndex !== -1) {
        // Splice the array to remove the post
        user.posts.splice(removeIndex, 1);
      } else {
        res.status(404);
        throw new Error('Post not found in user\'s post list');
      }

      await user.save()

      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getUserPosts = async (req, res) => { 
  try {
    const userId = req.params.userId; // Assuming you have the userId available in the request params

    // Find the user by userId and populate the 'posts' field to get the associated posts
    const user = await User.findById(userId).populate('posts');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = user.posts;

    // Return the posts as a response
    return res.json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



export {
  registerUser,
  loginUser,
  userProfile,
  updateProfile,
  updateProfilePicture,
  addPostToUser,
  deletePostFromUser,
  getUserPosts
};

