//
// AUTO SAVE DRAFT
// Create new draft OR update existing draft

import { agenda } from "../config/agenda.js";
import Post from "../models/post.js";
import { AuthRequest } from "../types/index.js";
import { CustomException } from "../utils/custom-exception.js";
import { Request, Response } from "express";

//
export const saveDraft = async (req: AuthRequest, res: Response) => {
  const { postId, title, description, content } = req.body;

  const userId = req.user.id;

  let post;

  // UPDATE existing draft
  if (postId) {
    post = await Post.findOneAndUpdate(
      {
        _id: postId,
        author: userId,
      },
      {
        title: title || "",
        description: description || "",
        content: content || "",
        status: "draft",
        lastSavedAt: new Date(),
      },
      {
        new: true,
      },
    );

    if (!post) {
      return new CustomException("Post not found", 404);
    }
  }

  // CREATE new draft
  else {
    post = await Post.create({
      title: title || "",
      description: description || "",
      content: content || "",
      author: userId,
      status: "draft",
      lastSavedAt: new Date(),
    });
  }

  return res.status(200).json({
    success: true,
    message: "Draft saved successfully",
    post,
  });
};

//
// PUBLISH POST
//
export const publishPost = async (req: AuthRequest, res: Response) => {
  const { postId, tags, picture } = req.body;
  const userId = req.user.id;

  const post = await Post.findOne({
    _id: postId,
    author: userId,
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  // Validation before publish
  if (!post.title || !post.description || !post.content) {
    return new CustomException(
      "Title, description and content are required before publishing",
      400,
    );
  }

  post.status = "published";
  post.publishedAt = new Date();
  post.scheduledFor = null;
  post.tags = tags || [];
  post.picture = picture || "";

  await post.save();

  return res.status(200).json({
    success: true,
    message: "Post published successfully",
    post,
  });
};

//
// SCHEDULE POST
//
export const schedulePost = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { postId, scheduledAt, picture, tags } = req.body;

  if (!scheduledAt) {
    return res.status(400).json({
      success: false,
      message: "scheduledAt is required",
    });
  }

  const post = await Post.findOne({
    _id: postId,
    author: userId,
  });

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found",
    });
  }

  post.status = "scheduled";
  post.scheduledFor = new Date(scheduledAt);
  post.tags = tags || [];
  post.picture = picture || "";

  await post.save();

  await agenda.schedule(new Date(scheduledAt), "publish post", {
    postId: post._id,
  });

  res.status(200).json({
    success: true,
    message: "Post scheduled successfully",
    data: post,
  });
};

//
// GET MY DRAFTS
//
export const getMyDrafts = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  const drafts = await Post.find({
    author: userId,
    status: "draft",
  }).sort({ updatedAt: -1 });

  return res.status(200).json({
    success: true,
    count: drafts.length,
    drafts,
  });
};

//
// DELETE DRAFT
//
export const deleteDraft = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findOneAndDelete({
    _id: postId,
    author: userId,
    status: "draft",
  });

  if (!post) {
    return new CustomException("Draft not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Draft deleted successfully",
  });
};

export const getAllPosts = async (req: Request, res: Response) => {
  const { search, category, page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const query: any = {};
  query.status = "published";

  if (category) {
    query.category = category;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  // ✅ Run both queries in parallel
  const [posts, totalCount] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate("author", "username name picture"),
    Post.countDocuments(query), // ✅ Total docs matching query, not just current page
  ]);

  return res.status(200).json({
    success: true,
    pagination: {
      count: totalCount, // ✅ total docs
      totalPages: Math.ceil(totalCount / parseInt(limit as string)), // ✅ correct
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    },
    posts,
  });
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { page = 1, limit = 10, search } = req.query;
  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const query: any = { author: userId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const [posts, totalCount] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate("author", "username name picture"),
    Post.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    pagination: {
      count: totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit as string)),
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    },
    posts,
  });
};
