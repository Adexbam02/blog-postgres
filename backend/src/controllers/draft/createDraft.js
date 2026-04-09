import pool from "../../db.js";

export const createDraft = async (req, res) => {
  try {
    const { authorId } = req.body;

    if (!authorId) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const { rows } = await pool.query(
      `
      INSERT INTO posts (user_id, status, title, content)
      VALUES ($1, 'draft', '', '')
      RETURNING id
      `,
      [authorId]
    );

    res.status(201).json({ postId: rows[0].id });
  } catch (error) {
    console.error("Create draft error:", error);
    res.status(500).json({ error: "Failed to create draft" });
  }
};