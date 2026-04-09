import pool from "../../db.js";

export const getPostBySlug = async (req, res) => {
  const { author, slug } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM posts
      WHERE LOWER(author) = LOWER($1)
      AND LOWER(slug) = LOWER($2)
      `,
      [author, slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};