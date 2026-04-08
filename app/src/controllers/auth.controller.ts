import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { RefreshToken } from "../models/token";
import { generateToken } from "../utils/generate-token";
import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import oauth2Client from "../config/google.config";
import { sendEmail } from "../services/email.service";
import { generateOTP } from "../utils/generate-otp";
import { CustomException } from "../utils/custom-exception";
const passport = require("passport");

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const otp = generateOTP();
  const hashPassword = await bcrypt.hash(password, 10);

  const token = generateToken(
    { email, password: hashPassword, name, otp },
    "5m",
  );
  return res.json({
    message: "OTP sent",
    token,
  });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { otp, token } = req.body;

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  if (decoded.otp !== otp) {
    throw new CustomException("Invalid OTP", 400);
  }

  const user = await User.create({
    email: decoded.email,
    name: decoded.name,
    password: decoded.password,
  });

  return res
    .status(200)
    .json({ message: "User registered successfully", user });
};

export const loginUser = async (req: any, res: any) => {
  const { email, password, deviceIp } = req.body;

  const user: IUser | null = await User.findOne({ email });

  if (!user) {
    throw new CustomException("User not found", 404);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new CustomException("Invalid credentials", 400);
  }

  const token = await generateToken(user, "1d");
  // const refreshToken = await generateRefreshToken(user, deviceIp);

  const userObj = user.toObject();
  delete userObj.password;

  return res.status(200).json({
    success: true,
    message: "User login successfully!",
    user: {
      token,
      // refreshToken,
      name: userObj.name,
      email: userObj.email,
      _id: userObj._id,
    },
  });
};

export const activeSessions = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const session = await RefreshToken.find({ userId }).select("-token");
    return res.status(200).json({ success: true, session });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
};

export const logoutUser = async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;
    await RefreshToken.deleteOne({ token: refreshToken });
    res
      .status(200)
      .json({ success: true, message: "Logged out from the device" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
};

// export const googleLogin = async (req, res) => {
//   const { code, deviceIp } = req.query;
//   try {
//     const googleRes = await oauth2Client.getToken(code as string);
//     oauth2Client.setCredentials(googleRes.tokens);
//     const userRes = await axios.get(
//       `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
//     );
//     const { email, name, picture } = userRes.data;
//     // console.log(userRes);
//     let user = await User.findOne({ email });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//       });
//     }
//     const token = await generateToken(user);

//     const refreshToken = await generateRefreshToken(user, deviceIp as string);
//     delete user.password;
//     console.log({
//       token: token,
//       refreshToken: refreshToken,
//       name: user.name,
//       email: user.email,
//       _id: user._id,
//     });
//     return res.status(200).json({
//       success: true,
//       message: "User login successfully!",
//       user: {
//         token: token,
//         refreshToken: refreshToken,
//         name: user.name,
//         email: user.email,
//         _id: user._id,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Internal Server Error",
//     });
//   }
// };

// export const googleCallback = (req: Request & { user: any }, res) => {
//   if (!req.user)
//     return res.status(401).json({ message: "Authentication failed" });

//   const { user, token, refreshToken } = req.user;
//   res.json({
//     message: "Login successful",
//     user: { token: token, refreshToken: refreshToken, user: user },
//   });
// };
