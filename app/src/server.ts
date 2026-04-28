import express from "express";
import connectDB from "./db/connect-db.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import http from "http";
import { initSocket } from "./socket.js";
import { globalException } from "./middleware/exception-handler.js";
import RedisService from "./config/redis.js";
import { seedSuperAdmin } from "./seeds/super-admin.js";
import path from "path";

const app = express();
const PORT = 5000;
const server = http.createServer(app);
initSocket(server);

app.use(
  cors({
    origin: ["https://blog-spot-client.onrender.com", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // only if using cookies or auth headers
  }),
);
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

connectDB();
const redis = RedisService.getInstance();
await redis.connect();

await seedSuperAdmin();
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/file", uploadRoutes);
app.use(globalException);

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
