import express, { Request, Response } from "express";
import User from "../models/user";
import { authenticateToken } from "../middleware/auth-middleware";
const router = express.Router();

router.get("/", authenticateToken, async (req: any, res: any) => {
  try {
    console.log(req.user, "-----users");
    const users = await User.find().select("-password");
    return res.status(200).json({ success: true, users: users });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

export default router;
