import pool from "../../db.js";

export const getAllPostsByAuthor = async (req, res) => {
  const { author } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM posts 
      WHERE LOWER(author) = LOWER($1)
      ORDER BY created_at DESC
      `,
      [author]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};