import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema(
  {
    followerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("follow", FollowSchema);
