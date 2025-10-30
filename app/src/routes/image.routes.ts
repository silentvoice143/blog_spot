import multer from "multer";
import path from "path";
import bucket from "../config/firebase.config";
import express from "express";
// Set up multer for handling file uploads (using memory storage for now)
const storage = multer.memoryStorage(); // You can use diskStorage if needed
const upload = multer({ storage });
const router = express.Router();

// Route for uploading files to Firebase Storage
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Create a reference to Firebase Storage with the file name
    const file = bucket.file(Date.now() + path.extname(req.file.originalname)); // Use timestamp for unique name

    // Upload the file to Firebase Storage
    await file.save(req.file.buffer, {
      contentType: req.file.mimetype,
      public: true, // Make the file publicly accessible (you can adjust permissions based on your needs)
    });

    // Get the public URL of the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
    console.log(publicUrl, "----url");
    res.status(200).json({
      success: true,
      message: "File uploaded successfully!",
      fileUrl: publicUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Failed to upload file.");
  }
});

export default router;
