import axios from "axios";
import express, { Request } from "express";
import User, { IUser } from "../models/user";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../utils/generate-token";
import { RefreshToken } from "../models/token";
import jwt from "jsonwebtoken";
import oauth2Client from "../config/google.config";
const passport = require("passport");
const router = express.Router();

/**
 * @swagger
 * /register-step1:
 *   post:
 *     summary: Register user with email and password (Step 1)
 *     tags:
 *       - Auth - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Step 1 completed successfully
 *       409:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */

router.post("/register-step1", async (req, res) => {
  console.log("signup hit");
  try {
    console.log(req.body, "----body");
    const { email, password } = req.body;

    const user: IUser = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .json({ message: "Already registered please login" });
    }
    console.log("here error");
    const newUser = new User({ email: email, password: password, step: 2 });
    await newUser.save();

    return res.status(200).json({
      message: "Step 1 complete",
      user: { step: 2, email: email },
    });
  } catch (error) {
    console.log(error, "---signup error");
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

/**
 * @swagger
 * /register-step2:
 *   post:
 *     summary: Send OTP to registered email (Step 2)
 *     tags:
 *       - Auth - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP sent successfully or already sent
 *       400:
 *         description: Step 1 not completed
 *       500:
 *         description: Server error
 */

router.post("/register-step2", async (req, res) => {
  try {
    const { email } = req.body;
    const user: IUser = await User.findOne({ email });
    if (!user || user.step < 1) {
      return res
        .status(400)
        .json({ message: "Step 1 not completed. Register first" });
    }

    const otpStillValid = user.otp && user.otpExpires > new Date();

    if (otpStillValid) {
      return res.status(200).json({
        message: "Otp already sent. Please verify",
        user: { email, step: 3 },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = expiry;
    user.step = 3;
    await user.save();
    console.log(`Send Otp ${otp} to email ${email}`);
    return res.status(200).json({
      message: "Otp sent. Please verify",
      user: { email: user.email, step: 3 },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

/**
 * @swagger
 * /register-step2-resendOtp:
 *   post:
 *     summary: Resend OTP for email verification (Step 2)
 *     tags:
 *       - Auth - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Step 1 not completed
 *       500:
 *         description: Server error
 */

router.post("/register-step2-resendOtp", async (req, res) => {
  try {
    const { email } = req.body;
    const user: IUser = await User.findOne({ email });
    if (!user || user.step < 1) {
      return res
        .status(400)
        .json({ message: "Step 1 not completed. Register first" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = expiry;
    user.step = 3;
    await user.save();
    console.log(`Send Otp ${otp} to email ${email}`);
    return res.status(200).json({
      message: "Otp sent. Please verify",
      user: { email: user.email, step: 3 },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

/**
 * @swagger
 * /register-step3:
 *   post:
 *     summary: Verify OTP (Step 3)
 *     tags:
 *       - Auth - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP, or OTP not sent
 *       500:
 *         description: Server error
 */

router.post("/register-step3", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user: IUser = await User.findOne({ email });
    if (!user || user.step < 3) {
      return res.status(400).json({ message: "Otp not sent yet" });
    }
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.step = 4;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res
      .status(200)
      .json({ message: "Otp verified", user: { email, step: 4 } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

/**
 * @swagger
 * /register-step4:
 *   post:
 *     summary: Complete registration with personal details (Step 4)
 *     tags:
 *       - Auth - Registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - address
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               address:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration complete
 *       400:
 *         description: OTP verification not completed
 *       500:
 *         description: Server error
 */
router.post("/register-step4", async (req, res) => {
  const { email, address, name } = req.body;

  const user: IUser = await User.findOne({ email });
  console.log(email, address, user);

  if (!user || user.step < 4) {
    return res.status(400).json({ message: "OTP verification not completed" });
  }

  user.step = 5;
  user.status = "active";
  user.address = address;
  user.name = name;

  await user.save();

  res.status(200).json({
    message: "Registration complete. You can now log in.",
    user: { email, step: 5 },
  });
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               deviceIp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post("/login", async (req: any, res: any) => {
  try {
    const { email, password, deviceIp } = req.body;
    const user: IUser = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ success: true, message: "User not found!" });

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched)
      return res
        .status(400)
        .json({ success: true, message: "Invalid credential" });

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
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Generate new access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *               deviceIp:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       403:
 *         description: Invalid token or device mismatch
 */
router.post("/refresh-token", async (req: any, res: any) => {
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
});

/**
 * @swagger
 * /auth/active-sessions/{userId}:
 *   get:
 *     summary: Get active sessions for a user
 *     tags: [Auth]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of active sessions
 */
router.get("/active-sessions/:userId", async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const session = await RefreshToken.find({ userId }).select("-token");
    return res.status(200).json({ success: true, session });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Server error ${error}` });
  }
});

/**
 * @swagger
 * /auth/logout-device:
 *   post:
 *     summary: Logout from a specific device
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout-device", async (req: any, res: any) => {
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
});

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login using Google OAuth2
 *     tags: [Auth]
 *     parameters:
 *       - name: code
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: deviceIp
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Google login successful
 */
// Google Auth
router.post("/google", async (req, res) => {
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
});

router.get(
  "/google",
  (req, res, next) => {
    console.log("hit this route", req.query);
    const deviceIp = req.query.deviceIp; // Extract IP from query
    res.cookie("deviceIp", deviceIp, { httpOnly: true, secure: false }); // Store IP in cookie
    next();
  },
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request & { user: any }, res) => {
    if (!req.user)
      return res.status(401).json({ message: "Authentication failed" });

    const { user, token, refreshToken } = req.user;
    res.json({
      message: "Login successful",
      user: { token: token, refreshToken: refreshToken, user: user },
    });
  }
);

// // Facebook Auth
// router.get("/facebook", passport.authenticate("facebook"));

// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", { session: false }),
//   (req: Request & { user: any }, res) => {
//     if (!req.user)
//       return res.status(401).json({ message: "Authentication failed" });

//     const { user, token, refreshToken } = req.user;
//     res.json({
//       message: "Login successful",
//       user: { token: token, refreshToken: refreshToken, user: user },
//     });
//   }
// );

export default router;
