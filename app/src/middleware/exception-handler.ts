import { CustomException } from "../utils/custom-exception.js";
import { Request, Response, NextFunction } from "express";

export const globalException = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomException) {
    return res.status(err.getStatus()).json({ message: err.message });
  }

  console.error(err); // Logs unexpected errors for debugging
  return res.status(500).json({ message: "Internal server error" });
};
