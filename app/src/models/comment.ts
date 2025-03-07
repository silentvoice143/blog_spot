import { timeStamp } from "console";
import mongoose, { Mongoose } from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    text: { type: String, required: true },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments", // Self-referencing for nested replies
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("comments", commentSchema);
export default Comment;
