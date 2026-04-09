import { authenticateToken } from "./../middleware/auth-middleware";
import express from "express";

import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyOtp,
} from "../controllers/auth.controller";
import { catchAsync } from "../utils/try-catch";
const passport = require("passport");
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user (Step 1 - Send OTP)
 *     tags: [Auth]
 *     description: Generates OTP and returns a temporary token valid for 5 minutes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP sent
 *                 token:
 *                   type: string
 *                   example: jwt_token_here
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and complete registration
 *     tags: [Auth]
 *     description: Verifies OTP using token and creates user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp, token]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *               token:
 *                 type: string
 *                 example: jwt_token_received_from_register
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *       400:
 *         description: Invalid or expired OTP
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               deviceIp:
 *                 type: string
 *                 example: 192.168.1.1
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User login successfully!
 *                 user:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: jwt_token_here
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: test@example.com
 *                     _id:
 *                       type: string
 *                       example: user_id_here
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */

router.post("/register", catchAsync(registerUser));
router.post("/verify-otp", catchAsync(verifyOtp));
router.post("/login", catchAsync(loginUser));
router.get("/user", authenticateToken, catchAsync(getUser));

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
// router.post("/refresh-token", authenticateToken, refreshToken);

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
// router.get("/active-sessions/:userId", authenticateToken, activeSessions);

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
router.post("/logout-device", authenticateToken, logoutUser);

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
// router.post("/google", googleLogin);

router.get(
  "/google",
  (req, res, next) => {
    const deviceIp = req.query.deviceIp;
    res.cookie("deviceIp", deviceIp, { httpOnly: true, secure: false });
    next();
  },
  passport.authenticate("google", { scope: ["profile"] }),
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", { session: false }),
//   googleCallback,
// );

export default router;
