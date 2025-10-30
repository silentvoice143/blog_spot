import { authenticateToken } from "./../middleware/auth-middleware";
import express from "express";

import {
  activeSessions,
  googleCallback,
  googleLogin,
  loginUser,
  logoutUser,
  refreshToken,
  registerStep1,
  registerStep2,
  registerStep3,
  registerStep4,
} from "../controllers/auth.controller";
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

router.post("/register-step1", registerStep1);

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

router.post("/register-step2", registerStep2);

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

router.post("/register-step2-resendOtp", registerStep2);

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

router.post("/register-step3", registerStep3);

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
router.post("/register-step4", registerStep4);

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
router.post("/login", loginUser);

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
router.post("/refresh-token", authenticateToken, refreshToken);

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
router.get("/active-sessions/:userId", authenticateToken, activeSessions);

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
router.post("/google", googleLogin);

router.get(
  "/google",
  (req, res, next) => {
    const deviceIp = req.query.deviceIp;
    res.cookie("deviceIp", deviceIp, { httpOnly: true, secure: false });
    next();
  },
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

export default router;
