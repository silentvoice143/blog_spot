// // firebase middleware
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// export const upload = multer({
//   storage,
// });

// middleware/upload.ts

// local storage middleware
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/";

// create uploads folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
});
