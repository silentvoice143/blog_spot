import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  googleId: string;
  facebookId: string;
  following: [any];
  followers: [any];
  links: [any];
  bio: string;
  step: number;
  otp: String;
  otpExpires: Date;
  status: string;
  address: string;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "active"],
      default: "pending",
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpites: {
      type: Date,
    },
    googleId: {
      type: String,
      required: false,
    },
    facebookId: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female", "other"] },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    links: {
      type: [
        {
          title: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", UserSchema);

export default User;
