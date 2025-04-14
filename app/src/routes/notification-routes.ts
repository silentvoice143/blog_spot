import express from "express";
import Notification from "../models/notification";
import { authenticateToken } from "../middleware/auth-middleware";

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for current user
// @access  Private
router.get("/", authenticateToken, async (req: any, res: any) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("fromUser", "name email") // only return needed fields
      .populate("post", "title") // optional: only if notification includes post
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/mark-read", authenticateToken, async (req, res) => {
  const { userId } = req.body; // The user whose notifications are being marked as read

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Update all notifications for the user as read
    const updatedNotifications = await Notification.updateMany(
      { user: userId, isRead: false }, // Find unread notifications for the user
      { $set: { isRead: true } } // Set them as read
    );

    res
      .status(200)
      .json({ message: "Notifications marked as read", updatedNotifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
