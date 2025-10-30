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
    const savedComment = new Comment({ userId: req.user.id, text,parentId: parentId || null, postId: postId});
    await savedComment.save();

    // Add comment ID to the related post
    await Post.findByIdAndUpdate(postId, { $push: { comments: savedComment._id } });
    // Populate userId to include only 'name'
    const comment = await Comment.findById(savedComment._id)
      .populate("userId", "name email")
      .lean();
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
      .populate("userId", "email name").sort({ createdAt: -1 })
      .lean();

    // const replies = await Comment.find({ postId: req.params.postId, parentId: { $ne: null } })
    //   .populate("userId", "name").limit(10)
    //   .lean();

      const replies = await Comment.find({ postId: req.params.postId, parentId: { $ne: null } })
      .populate("userId", "name") // Populate reply owner
      .populate({
        path: "parentId",
        populate: { path: "userId", select: "name" }, // Populate parent comment's userId (name only)
        select: "userId", // Exclude text from parentId
      }).sort({createdAt:-1})
      .limit(10)
      .lean();

      console.log(replies,"----replies")

      

    const commentMap = {};
    comments.forEach((comment) => (commentMap[comment._id.toString()] = { ...comment, replies: [] }));

    replies.forEach((reply) => {
      if (commentMap[reply.parentId._id.toString()]) {
        commentMap[reply.parentId._id.toString()].replies.push(reply);
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

// router.post("/reply/:commentId", authenticateToken, async (req:any, res:any) => {
//   try {
//     const { text ,postId} = req.body;

//     const newReply = new Comment({
//       postId: postId,
//       userId: req.user.id,
//       text,
//       parentId: req.params.commentId,
//     });

//     const savedReply = (await newReply.save()).populate("parentId","name");
//     res.status(201).json({message:"reply added successfully!",savedReply});
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/reply/:commentId", authenticateToken, async (req:any, res:any) => {   
  try {     
    const { text, postId } = req.body;      

    // Create a new reply
    const newReply = new Comment({       
      postId: postId,       
      userId: req.user.id,       
      text,       
      parentId: req.params.commentId,     
    });      

    // Save the reply
    const savedReply = await newReply.save(); 

    // Populate parentId
    const populatedReply = await Comment.findById(savedReply._id)
      .populate({
        path: "parentId",
        populate: { path: "userId", select: "name" }, // Only fetch `name` from userId inside parentId
        select: "userId", // Exclude `text`, only keep `userId`
      })
      .populate("userId", "name");

    res.status(201).json({ message: "Reply added successfully!", populatedReply });   
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
