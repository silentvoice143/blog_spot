import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    dop: {
      type: Date,
      required: true,
    },
    picture: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    tags: {
      type: [{ type: String }],
    },
    view: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
  },
  { timestamps: true }
);

const Post = mongoose.model("posts", postSchema);

export default Post;
