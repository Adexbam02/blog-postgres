import pool from "../../db.js";

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    // Fallback in case old tokens don't have username payload
    const username = req.user.username || "Someone";
    const { postId } = req.params;

    // 1. Check post exists and get the original author ID simultaneously
    const post = await pool.query(
      "SELECT id, user_id FROM posts WHERE id = $1",
      [postId],
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const postOwnerId = post.rows[0].user_id;

    // 2. Safely insert like (ignoring high-speed duplicate clicks natively via Postgres)
    const result = await pool.query(
      `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING id
      `,
      [userId, postId],
    );

    // If no row was returned, Postgres caught a duplicate
    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "You already liked this post",
      });
    }

    // 3. Increment the post's global like count tally
    await pool.query("UPDATE posts SET likes = likes + 1 WHERE id = $1", [
      postId,
    ]);

    // 4. Create a notification (only if the user isn't liking their own post)
    if (postOwnerId !== userId) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, message, actor_id, post_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [postOwnerId, "like", `${username} liked your post`, userId, postId],
      );
    }

    return res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error("Error heavily mapped in likePost:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong liking the post" });
  }
};
