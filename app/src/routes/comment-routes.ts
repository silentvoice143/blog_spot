import express from "express";
import Comment from "../models/comment";
import Post from "../models/post";
import { authenticateToken } from "../middleware/auth-middleware";
import checkCommentOwner from "../middleware/check-commenter";
import checkCommentEditor from "../middleware/check-comment-editor";
import Reply from "../models/reply";
const router = express.Router();


router.post("/", authenticateToken, async (req: any, res: any) => {
  try {
    console.log("comment", req.body, req.user);
    const { postId, text,parentId } = req.body;

    if (!postId || !text) {
      return res
        .status(400)
        .json({ error: "Post ID, author, and text are required" });
    }

    // Create new comment
    const comment = new Comment({ userId: req.user.id, text,parentId: parentId || null, postId: postId});
    await comment.save();

    // Add comment ID to the related post
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment });
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ error: "Error while saving comment", details: err.message });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    console.log("getting comments,------")
    const comments = await Comment.find({ postId: req.params.postId, parentId: null })
      .populate("userId", "email name")
      .lean();

    const replies = await Comment.find({ postId: req.params.postId, parentId: { $ne: null } })
      .populate("userId", "email name")
      .lean();

      

    const commentMap = {};
    comments.forEach((comment) => (commentMap[comment._id.toString()] = { ...comment, replies: [] }));

    replies.forEach((reply) => {
      if (commentMap[reply.parentId.toString()]) {
        commentMap[reply.parentId.toString()].replies.push(reply);
      }
    });

    res.status(200).json(Object.values(commentMap));
  } catch (error) {
    res.status(500).json({ message: error.message });
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

router.post("/reply/:commentId", authenticateToken, async (req:any, res:any) => {
  try {
    const { text ,postId} = req.body;

    const newReply = new Comment({
      postId: postId,
      userId: req.user.id,
      text,
      parentId: req.params.commentId,
    });

    const savedReply = await newReply.save();
    res.status(201).json(savedReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/like/:commentId", authenticateToken, async (req:any, res:any) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(req.user.id)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
