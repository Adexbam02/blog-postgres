import db from "../../db.js";

export const updateDraft = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;

  try {
    const result = await db.query(`
      UPDATE posts 
      SET title = $1, content = $2, updated_at = NOW()
      WHERE id = $3 AND status = 'draft'
      RETURNING id
    `, [title, content, postId]);

    res.json({ success: true, updated: result.rowCount > 0 });
  } catch (err) {
    console.error("Update draft error:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};