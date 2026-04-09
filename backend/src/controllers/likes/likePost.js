import pool from "../../db.js";

export const likePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // Check post exists
    const post = await pool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Insert like (ignore duplicates)
    const result = await pool.query(
      `
      INSERT INTO likes (user_id, post_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING id
      `,
      [userId, postId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "You already liked this post",
      });
    }

    return res.json({ message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};