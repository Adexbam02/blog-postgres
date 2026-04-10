import pool from "../../db.js";

export const commentOnPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const username = req.user.username || "Someone";
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

    // Check if post exists and get the author's ID for the notification
    const postResult = await pool.query(
      `SELECT id, user_id FROM posts WHERE id = $1`,
      [postId],
    );
    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Extract postOwnerId
    const postOwnerId = postResult.rows[0].user_id;

    // Insert comment
    const insertResult = await pool.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postId, userId, content],
    );

    const newCommentId = insertResult.rows[0].id;

    // Trigger Notification securely
    if (postOwnerId !== userId) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, message, actor_id, post_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          postOwnerId,
          "comment",
          `${username} commented on your post`,
          userId,
          postId,
        ],
      );
    }

    // Fetch the created comment to return
    const newCommentResult = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.username, u.profile_picture_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [newCommentId],
    );

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newCommentResult.rows[0],
    });
  } catch (error) {
    console.error("Comment error:", error);
    return res.status(500).json({ error: "Failed to add comment" });
  }
};
