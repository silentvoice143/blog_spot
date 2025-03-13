import Comment from "../models/comment";
import Post from "../models/post";

const checkCommentOwner = async (req: any, res: any, next: any) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.user.id; // Extract userId from request body (or from token if using JWT)

    // Find the comment
    const comment = await Comment.findById(commentId).select("user");
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const post = await Post.findById(postId).select("author");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is either:
    // 1. The comment owner
    // 2. The post owner (post author can delete any comment on their post)
    if (
      comment.userId.toString() !== userId &&
      post.author.toString() !== userId
    ) {
      return res.status(403).json({
        error:
          "Unauthorized: Only the comment owner or post owner can delete this comment",
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

export default checkCommentOwner;
