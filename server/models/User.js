import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    role: { 
      type: String, 
      default: "user" 
    },
    description: String,
    viewedProfile: {
      type:Number,
      default: 0}
      ,
    impressions: { 
      type:Number, 
      default: 0 
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
