import pool from "../../db.js";

export const getAllPostsByAuthorId = async (req, res) => {
  const userId = req.params.id;

  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM posts 
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts by user ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};