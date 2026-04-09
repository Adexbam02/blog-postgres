import pool from "../../db.js";

export const checkLike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    // Check post exists
    const post = await pool.query(
      "SELECT id FROM posts WHERE id = $1",
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check like
    const like = await pool.query(
      "SELECT id FROM likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );

    return res.json({ liked: like.rows.length > 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};