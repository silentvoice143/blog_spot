import express from "express";
import { authenticateToken } from "../middleware/auth-middleware.js";
import { catchAsync } from "../utils/try-catch.js";
import {
    saveDraft,
    publishPost,
    getMyDrafts,
    deleteDraft,
    schedulePost,
    getUserPosts,
    getAllPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

//
// AUTO SAVE DRAFT
// Create new draft OR update existing draft
//
router.post(
    "/save-draft",
    authenticateToken,
    catchAsync(saveDraft)
);

//
// PUBLISH POST
//
router.post(
    "/publish",
    authenticateToken,
    catchAsync(publishPost)
);

//
// SCHEDULE POST
//
router.post(
    "/schedule",
    authenticateToken,
    catchAsync(schedulePost)
);

//
// GET ALL MY DRAFTS
//
router.get(
    "/my-drafts",
    authenticateToken,
    catchAsync(getMyDrafts)
);

//
// DELETE DRAFT
//
router.delete(
    "/draft/:postId",
    authenticateToken,
    catchAsync(deleteDraft)
);

//
// GET ALL MY POST
//
router.get(
    "/my-posts",
    authenticateToken,
    catchAsync(getUserPosts)
);

//
// GET ALL POSTS
//
router.get(
    "/all-posts",
    catchAsync(getAllPosts)
);

//
// UPDATE POST
//
// router.put(
//     "/update/:postId",
//     authenticateToken,
//     catchAsync(updatePost)
// );



export default router;