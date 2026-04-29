import express from "express";
import { authenticateToken } from "../middleware/auth-middleware.js";
import { catchAsync } from "../utils/try-catch.js";
import {
    saveDraft,
    publishPost,
    getMyDrafts,
    deleteDraft,
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

export default router;