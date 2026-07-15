import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },

    picture: {
      type: String,
      default: "",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    tags: {
      type: [{ type: String }],
      default: [],
    },

    view: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "private"],
      default: "draft",
    },

    scheduledFor: {
      type: Date,
      required: false,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },

    lastSavedAt: {
      type: Date,
      default: Date.now,
    },

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Post = mongoose.model("post", postSchema);

export default Post;
