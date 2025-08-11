import { authenticateToken } from "./../middleware/auth-middleware";
import express from "express";
import Post from "../models/post";
import Notification from "../models/notification";
import User, { IUser } from "../models/user";
import { sendNotification } from "../socket";

const router = express.Router();

router.post("/", authenticateToken, async (req: any, res: any) => {
  console.log("creating post,,,,");
  try {
    const postData = {
      ...req.body,
      dop: new Date(),
      author: req.user.id,
      view: 0,
    };
    const post = new Post(postData);

    await post.save();
    const author: any = await User.findById(req.user.id).populate("followers");

    for (let follower of author.followers) {
      const notif = await Notification.create({
        user: follower._id,
        fromUser: req.user.id,
        type: "new_post",
        post: post._id,
      });

      const populatedNotif = await Notification.findById(notif._id).populate(
        "fromUser"
      );

      await sendNotification({
        toUserId: follower._id.toString(),
        notification: populatedNotif,
      });
    }
    return res.status(201).json({
      success: true,
      message: "successfully post created",
      post: post,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: true, error: err });
  }
});

router.post("/view/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    console.log(postId, "----post");
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(400)
        .json({ success: true, message: "Post not found!" });
    }

    post.view += 1;
    post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post view added!", view: post.view });
  } catch (err) {
    return res.status(400).json({ success: true, error: err });
  }
});

router.get("/", async (req: any, res: any) => {
  try {
    console.log("hitting this route");

    const category = req.query.category;
    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = parseInt(req.query.limit) || 10; // default limit 10
    const skip = (page - 1) * limit;

    let query: any = {};
    if (category && category.length > 0) {
      query.category = category[0];
    }

    // Fetch posts with pagination
    const posts = await Post.find(query)
      .populate("author", "name email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // optional: most recent first

    // Count total documents for frontend pagination
    const total = await Post.countDocuments(query);

    return res.status(200).json({
      success: true,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        totalCount: total,
      },
      posts,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ error: err.message || "Server Error" });
  }
});

router.get(
  "/get-all-posts/:userId",
  authenticateToken,
  async (req: any, res: any) => {
    try {
      const userId = req.params.userId;

      const posts = await Post.find({ author: userId })
        .populate("author", "name email")
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, posts: posts });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: `Server error ${error}` });
    }
  }
);

router.get("/recommended", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ view: -1 });
    return res.status(200).json({ success: true, recommendedPost: posts });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.get("/detail/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const post = await Post.findById({ _id: id }).populate(
      "author",
      "name email"
    );
    if (post) {
      delete post.__v;
      return res
        .status(200)
        .json({ message: "successfully get the post", post: post });
    } else {
      return res.status(400).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err });
  }
});

router.put("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { title, content, description, status } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          title,
          content,
          description,
          status: status === "publish" ? "publish" : "draft",
        },
      },
      { new: true }
    );
    if (updatedPost) {
      return res
        .status(200)
        .json({ message: "post updated successfully", updatedPost });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error updating post. ${error}` });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete({ _id: id });
    if (deletedPost) {
      res.json({ message: "Post deleted successfully." });
    } else {
      res.status(404).json({ message: "Post not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting post." });
  }
});

export default router;
