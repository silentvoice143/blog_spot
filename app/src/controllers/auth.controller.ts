import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { RefreshToken } from "../models/token";
import { generateRefreshToken, generateToken } from "../utils/generate-token";
import axios from "axios";
import { Request } from "express";
import jwt from "jsonwebtoken";
import oauth2Client from "../config/google.config";
import { sendEmail } from "../services/email.service";
const passport = require("passport");

// ✅ STEP 1: Register (email + password)
export const registerStep1 = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Signup hit with:", email);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user: IUser = await User.findOne({ email });

    if (user) {
      if (user.step === 5) {
        return res
          .status(409)
          .json({ message: "User already registered. Please log in." });
      } else {
        return res.status(200).json({
          message: `You have already started registration. Continue from step ${user.step}.`,
          user: { email, step: user.step },
        });
      }
    }

    const newUser = new User({
      email,
      password,
      step: 2,
      status: "pending",
    });

    await newUser.save();

    return res.status(200).json({
      message: "Step 1 complete — proceed to OTP verification.",
      user: { email, step: 2 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// ✅ STEP 2: Send OTP
export const registerStep2 = async (req, res) => {
  try {
    const { email } = req.body;
    const user: IUser = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No account found. Please register first." });
    }

    if (user.step < 2) {
      return res.status(400).json({ message: "Step 1 not completed yet." });
    }

    // Reuse existing valid OTP if still valid
    const otpStillValid = user.otp && user.otpExpires > new Date();
    if (otpStillValid) {
      return res.status(200).json({
        message: "OTP already sent. Please verify.",
        user: { email, step: 3 },
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min validity

    user.otp = otp;
    user.otpExpires = expiry;
    user.step = 3;
    await user.save();

    console.log(`OTP ${otp} sent to ${email}`);

    await sendEmail({
      to: email,
      subject: "Your One-Time Password (OTP) for SlotSwapper",
      html: `
        <h3>Hello,</h3>
        <p>Your one-time password (OTP) is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
      `,
    });

    return res.status(200).json({
      message: "OTP sent successfully. Please verify.",
      user: { email, step: 3 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// ✅ STEP 3: Verify OTP
export const registerStep3 = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user: IUser = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.step < 3) {
      return res.status(400).json({ message: "OTP not yet sent." });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    user.step = 4;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully.",
      user: { email, step: 4 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// ✅ STEP 4: Complete Registration (add name, address)
export const registerStep4 = async (req, res) => {
  try {
    const { email, name, address } = req.body;
    const user: IUser = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.step < 4) {
      return res
        .status(400)
        .json({ message: "OTP verification not completed." });
    }

    user.name = name;
    user.address = address;
    user.status = "active";
    user.step = 5;

    await user.save();

    return res.status(200).json({
      message: "Registration complete! You can now log in.",
      user: { email, step: 5 },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const loginUser = async (req: any, res: any) => {
  try {
    const { email, password, deviceIp } = req.body;
    const user: IUser = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credential" });

    const token = await generateToken(user);

    const refreshToken = await generateRefreshToken(user, deviceIp);
    delete user.password;

    return res.status(200).json({
      success: true,
      message: "User login successfully!",
      user: {
        token: token,
        refreshToken: refreshToken,
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
};

export const refreshToken = async (req: any, res: any) => {
  try {
    const { refreshToken, deviceIp } = req.body;

    const storedtoken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedtoken)
      return res
        .status(401)
        .json({ success: true, message: "Refresh token required" });

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, user) => {
      if (err)
        return res
          .status(403)
          .json({ success: true, message: "Invalid token" });

      if (storedtoken.ipAddress !== deviceIp) {
        return res.status(403).json({
          success: true,
          message: "Device mismatch, please login again",
        });
      }

      const accessToken = await generateToken(user);
      return res.status(200).json({
        success: true,
        message: "token created",
        accessToken: accessToken,
      });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
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

export const googleLogin = async (req, res) => {
  const { code, deviceIp } = req.query;
  try {
    const googleRes = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(googleRes.tokens);
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const { email, name, picture } = userRes.data;
    // console.log(userRes);
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }
    const token = await generateToken(user);

    const refreshToken = await generateRefreshToken(user, deviceIp as string);
    delete user.password;
    console.log({
      token: token,
      refreshToken: refreshToken,
      name: user.name,
      email: user.email,
      _id: user._id,
    });
    return res.status(200).json({
      success: true,
      message: "User login successfully!",
      user: {
        token: token,
        refreshToken: refreshToken,
        name: user.name,
        email: user.email,
        _id: user._id,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const googleCallback = (req: Request & { user: any }, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Authentication failed" });

  const { user, token, refreshToken } = req.user;
  res.json({
    message: "Login successful",
    user: { token: token, refreshToken: refreshToken, user: user },
  });
};
