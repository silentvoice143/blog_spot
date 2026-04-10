import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.js";
import { RefreshToken } from "../models/token.js";
import { generateToken } from "../utils/generate-token.js";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { generateOTP } from "../utils/generate-otp.js";
import { CustomException } from "../utils/custom-exception.js";
import { AuthRequest } from "../types/index.js";
import RedisService from "../config/redis.js";
import { sendEmail } from "../services/email.service.js";
const redis = RedisService.getInstance().getClient();

export const registerUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const existingOtp = await redis.get(`otp:${email}`);

  if (existingOtp) {

    const ttl = await redis.ttl(`otp:${email}`);

    throw new CustomException(
      `OTP already sent. Please wait ${ttl} seconds to resend.`, 400
    );
  }
  const otp = generateOTP();
  await redis.set(`otp:${email}`, otp, {
    EX: 40,
  });
  console.log(email, name)
  sendEmail({
    to: email,
    subject: "OTP",
    text: `Your OTP is ${otp}`,
  });

  console.log("Generated OTP:", otp);

  return res.json({
    message: "OTP sent",
    user: { email, name }
  });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, name, otp, password } = req.body;

  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw new CustomException("Invalid or expired OTP", 400);
  }

  // Delete OTP after successful verification
  await redis.del(`otp:${email}`);


  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email: email,
    name: name,
    password: hashedPassword
  });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj._v;

  return res
    .status(200)
    .json({ message: "User registered successfully", user: userObj });
};

export const loginUser = async (req: any, res: any) => {
  const { email, password, deviceIp } = req.body;
  console.log(email, password, deviceIp);

  const user: IUser | null = await User.findOne({ email });

  if (!user) {
    throw new CustomException("User not found", 404);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new CustomException("Invalid credentials", 400);
  }

  const token = await generateToken({ id: user._id, name: user.name }, "1d");
  // const refreshToken = await generateRefreshToken(user, deviceIp);

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj._v;

  return res.status(200).json({
    success: true,
    message: "User login successfully!",
    user: userObj,
    token: token,
  });
};

export const getUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.user;
  const user = await User.findById(id);
  if (!user) {
    throw new CustomException("User not found", 404);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj._v;

  return res.status(200).json({ success: true, user: userObj });
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
