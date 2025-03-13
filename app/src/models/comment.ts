import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    text: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: null }, // For replies
    rootId: { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: null }, // For replies
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  },
  { timestamps: true }
);

export default mongoose.model("comment", commentSchema);