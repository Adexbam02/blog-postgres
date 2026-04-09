import db from "../../db.js";

export const commentOnPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;
    const { content } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    // Validate postId
    if (!postId || isNaN(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    // Optional: Check if post exists
    const postResult = await db.query(`SELECT id FROM posts WHERE id = $1`, [postId]);
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Insert comment
    const insertResult = await db.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postId, userId, content]
    );

    const newCommentId = insertResult.rows[0].id;

    // Fetch the created comment to return
    const newCommentResult = await db.query(
      `SELECT c.id, c.content, c.created_at, u.username, u.profile_picture_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [newCommentId]
    );

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newCommentResult.rows[0]
    });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};