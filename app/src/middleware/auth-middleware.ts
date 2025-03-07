import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res
      .status(401)
      .json({ success: true, message: "Unauthorized: No token provided!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ success: true, message: "Forbidden: Invalid token" });
    }
    req.user = user;
    next();
  });
};
