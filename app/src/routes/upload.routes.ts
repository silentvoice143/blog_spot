import express from "express";
import { authenticateToken } from "../middleware/auth-middleware.js";
import { upload } from "../middleware/upload.js";
import { catchAsync } from "../utils/try-catch.js";
import {
  uploadMultipleFiles,
  uploadSingleFile,
} from "../controllers/upload.controller.js";
const router = express.Router();
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  catchAsync(uploadSingleFile),
);

router.post(
  "/upload-multiple",
  authenticateToken,
  upload.array("files", 10),
  catchAsync(uploadMultipleFiles),
);

export default router;
