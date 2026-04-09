import pool from "../../db.js";

export const getAllPosts = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};