import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types";

export const catchAsync = (
  fn: (req: any, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: any, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// export const catchAsync = <T extends Request>(
//   fn: (req: T, res: Response, next: NextFunction) => Promise<any>,
// ) => {
//   return (req: T, res: Response, next: NextFunction) => {
//     fn(req, res, next).catch(next);
//   };
// };
