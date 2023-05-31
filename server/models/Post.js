import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    brand : {type: String, required: false},
    series : {type: String, required: false}, 
    model : {type: String, required: false}, 
    produced: {type: String, required: false}, 
    color : {type: String, required: false},  
    price : {type: Number, required: true}, 
    likecount : {type: Number, required: false}, 
    slug: { type: String, required: true, unique: true },
    detail: { type: Object, required: true },
    photo: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String] },
    categories: [String],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

const Post = model("Post", PostSchema);
export default Post;
