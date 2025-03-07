import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiteAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

export const RefreshToken = mongoose.model("refreshtoken", refreshTokenSchema);
