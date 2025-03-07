import express from "express";
import Comment from "../models/comment";
import Post from "../models/post";
import { authenticateToken } from "../middleware/auth-middleware";
import checkCommentOwner from "../middleware/check-commenter";
import checkCommentEditor from "../middleware/check-comment-editor";
const router = express.Router();

router.post("/", authenticateToken, async (req: any, res: any) => {
  try {
    console.log("comment", req.body, req.user);
    const { postId, text } = req.body;

    if (!postId || !text) {
      return res
        .status(400)
        .json({ error: "Post ID, author, and text are required" });
    }

    // Create new comment
    const comment = new Comment({ user: req.user.id, text });
    await comment.save();

    // Add comment ID to the related post
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error while saving comment", details: err.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const comments = await Comment.find({ postId: id })
      .populate("user", "name email")
      .populate({
        path: "replies",
        populate: { path: "user", select: "name email" }, // Populate user details in replies
      });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(401).json({ error: "Error while fetching comments" });
  }
});

router.put(
  "/:postId/:commentId",
  authenticateToken,
  checkCommentEditor,
  async (req: any, res: any) => {
    try {
      const { commentId } = req.params;
      const { text } = req.body;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Update the comment text
      comment.text = text;
      await comment.save();

      return res
        .status(200)
        .json({ message: "Comment updated successfully", comment });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error while updating comment", details: err.message });
    }
  }
);

router.delete(
  "/:postId/:commentId",
  authenticateToken,
  checkCommentOwner,
  async (req: any, res: any) => {
    try {
      const { commentId, postId } = req.params;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }

      // Remove the comment
      await comment.deleteOne();

      // Remove comment ID from the post
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: comment._id },
      });

      return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Error while deleting comment", details: err.message });
    }
  }
);

export default router;
