import express from "express";
import connectDB from "./db/connect-db";
import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";
import commentRoutes from "./routes/comment-routes";
import fileRoutes from "./routes/image-routes";
import postRoutes from "./routes/post-routes";
import cors from "cors";
const passport = require("passport");
require("./config/passport.config");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/post", postRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
