import express from "express";
import db from "../db.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { getAllPosts } from "../controllers/post/getAllPosts.js";
import { createPost } from "../controllers/post/createPost.js";
import { getPostBySlug } from "../controllers/post/getPostBySlug.js";
import { getAllPostsByAuthor } from "../controllers/post/getPostByAuthor.js";
import { likePost } from "../controllers/likes/likePost.js";
import { unLikePost } from "../controllers/likes/unLikePost.js";
import { countLikes } from "../controllers/likes/countLikes.js";
import { checkLike } from "../controllers/likes/checkLike.js";
import { deletePost } from "../controllers/post/deletePost.js";
import { mostLike } from "../controllers/likes/mostLike.js";
import { editPost } from "../controllers/post/editPost.js";
import { commentOnPost } from "../controllers/comment/commentOnPost.js";
import { getCommentsByPostId } from "../controllers/comment/getCommentsByPostId.js";
import { deleteComment } from "../controllers/comment/deleteComment.js";
import { postView } from "../controllers/postViews.js";
import { getViewCount } from "../controllers/getViewCount.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { getUserTotalViewsInLastOneHr } from "../controllers/user/getUserViewGrowthToday.js";
import { getAllPostsByAuthorId } from "../controllers/post/getPostByUserId.js";
// import { draftedPost } from "../controllers/draftedPost.js";

const router = express.Router();

// POST create post
router.post("/", authenticateToken, createPost);

// DELETE delete post
router.delete("/:id", authenticateToken, deletePost);

// GET all posts
router.get("/", getAllPosts);

// Like routes (specific paths)
router.post("/like/:postId", authenticateToken, likePost);
router.delete("/like/:postId", authenticateToken, unLikePost);

// Count likes for a post (specific path)
router.get("/:postId/likes", countLikes);

// Optional: Route by slug
router.get("/slug/:slug/likes", countLikes);

router.get("/:postId/liked", authenticateToken, checkLike);

router.get("/most-liked", mostLike);

router.patch("/edit-post/:postId", authenticateToken, editPost);

router.post("/comment/:postId", authenticateToken, commentOnPost);

router.get("/comment/:postId", getCommentsByPostId);

router.delete("/comment/:commentId", authenticateToken, deleteComment);

router.post("/views/:postId", optionalAuth, postView);
router.get("/views/:postId", getViewCount);

// router.put("/draft", authenticateToken, draftedPost);
// router.get("/views/:userId", getUserTotalViews);
// router.get("/views/growth/:postId", getUserTotalViewsInLastOneHr);

// Get posts by username - MOVE THIS DOWN
router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const postsResult = await db.query(
      "SELECT * FROM posts WHERE author = $1 ORDER BY created_at DESC",
      [username]
    );
    res.status(200).json(postsResult.rows);
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all posts by author (already generic)
router.get("/:author", getAllPostsByAuthor);
// Get all posts by author (already generic)
router.get("/id/:id", getAllPostsByAuthorId);

// Get post by author and slug (most generic - must be last)
router.get("/:author/:slug", getPostBySlug);

export default router;
