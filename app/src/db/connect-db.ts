import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  console.log(MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "appserver",
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
