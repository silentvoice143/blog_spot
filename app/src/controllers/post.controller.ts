

//
// AUTO SAVE DRAFT
// Create new draft OR update existing draft

import Post from "../models/post.js";
import { AuthRequest } from "../types/index.js";
import { CustomException } from "../utils/custom-exception.js";
import { Request, Response } from "express";

//
export const saveDraft = async (req: AuthRequest, res: Response) => {

    const {
        postId,
        title,
        description,
        content,
    } = req.body;

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
            }
        );

        if (!post) {
            return new CustomException("Post not found", 404)
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
    if (
        !post.title ||
        !post.description ||
        !post.content
    ) {
        return new CustomException("Title, description and content are required before publishing", 400)
    }

    post.status = "publish";
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
export const deleteDraft = async (req, res) => {

    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findOneAndDelete({
        _id: postId,
        author: userId,
        status: "draft",
    });

    if (!post) {

        return new CustomException("Draft not found", 404)
    }

    return res.status(200).json({
        success: true,
        message: "Draft deleted successfully",
    });

};