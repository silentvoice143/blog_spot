import { Request, Response } from "express";
import { bucket } from "../config/firebase.js";
import fs from "fs";
import { CustomException } from "../utils/custom-exception.js";

// export const uploadSingleFile = async (req: Request, res: Response) => {
//   if (!req.file) {
//     throw new CustomException("No file uploaded", 400);
//   }

//   const localFilePath = req.file.path;

//   const firebaseFileName = `posts/${Date.now()}-${req.file.originalname}`;

//   await bucket.upload(localFilePath, {
//     destination: firebaseFileName,
//     metadata: {
//       contentType: req.file.mimetype,
//     },
//   });

//   await bucket.file(firebaseFileName).makePublic();

//   const fileUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseFileName}`;

//   fs.unlinkSync(localFilePath);

//   return res.status(200).json({
//     success: true,
//     fileUrl,
//   });
// };

// export const uploadMultipleFiles = async (req: Request, res: Response) => {
//   const files = req.files as Express.Multer.File[];

//   if (!files || files.length === 0) {
//     throw new CustomException("No files uploaded", 400);
//   }

//   const uploadedUrls: string[] = [];

//   for (const file of files) {
//     const localFilePath = file.path;

//     const firebaseFileName = `posts/${Date.now()}-${file.originalname}`;

//     await bucket.upload(localFilePath, {
//       destination: firebaseFileName,
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     await bucket.file(firebaseFileName).makePublic();

//     const fileUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseFileName}`;

//     uploadedUrls.push(fileUrl);

//     // remove local temp file
//     fs.unlinkSync(localFilePath);
//   }

//   return res.status(200).json({
//     success: true,
//     files: uploadedUrls,
//   });
// };

export const uploadSingleFile = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new CustomException("No file uploaded", 400);
  }

  // local file URL
  const fileUrl = `${req.protocol}://${req.get(
    "host",
  )}/uploads/${req.file.filename}`;

  return res.status(200).json({
    success: true,
    fileUrl,
  });
};

export const uploadMultipleFiles = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new CustomException("No files uploaded", 400);
  }

  const fileUrls = files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
  );

  return res.status(200).json({
    success: true,
    files: fileUrls,
  });
};
