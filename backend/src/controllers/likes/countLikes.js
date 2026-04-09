import pool from "../../db.js";

export const countLikes = async (req, res) => {
  try {
    const { postId, slug } = req.params;

    let postQuery;

    if (postId) {
      postQuery = await pool.query(
        "SELECT id FROM posts WHERE id = $1",
        [postId]
      );
    } else if (slug) {
      postQuery = await pool.query(
        "SELECT id FROM posts WHERE slug = $1",
        [slug]
      );
    } else {
      return res.status(400).json({ error: "Post ID or slug required" });
    }

    if (postQuery.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postQuery.rows[0];

    const result = await pool.query(
      "SELECT COUNT(*)::int AS total FROM likes WHERE post_id = $1",
      [post.id]
    );

    return res.json({ total: result.rows[0].total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};