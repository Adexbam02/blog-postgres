import pool from "../db.js";

export const getViewCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT COUNT(*)::int AS count 
      FROM post_views 
      WHERE post_id = $1
      `,
      [postId]
    );

    res.status(200).json({ views: rows[0].count });
  } catch (error) {
    console.error("Error getting view count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};