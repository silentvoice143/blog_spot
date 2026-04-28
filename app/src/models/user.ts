import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  _id: string;
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
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  address: string;
  role: "SUPER_ADMIN" | "USER";
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
      enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
      default: "INACTIVE",
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
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", UserSchema);

export default User;
