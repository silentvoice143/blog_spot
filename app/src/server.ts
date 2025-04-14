import express from "express";
import connectDB from "./db/connect-db";
import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";
import commentRoutes from "./routes/comment-routes";
import fileRoutes from "./routes/image-routes";
import postRoutes from "./routes/post-routes";
import notificationRoutes from "./routes/notification-routes";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import http from "http";
import { initSocket } from "./socket";

require("./config/passport.config");

const app = express();
const PORT = 5000;
const server = http.createServer(app);
initSocket(server);

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
