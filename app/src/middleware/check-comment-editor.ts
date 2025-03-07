import Comment from "../models/comment";

const checkCommentEditor = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // Extract user ID from JWT token

    // Find the comment and fetch only the 'author' field
    const comment = await Comment.findById(commentId).select("user");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment owner
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        error: "Unauthorized: Only the comment owner can edit this comment",
      });
    }

    // User is authorized, proceed to the next function
    next();
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Server error", details: err.message });
  }
};

export default checkCommentEditor;
