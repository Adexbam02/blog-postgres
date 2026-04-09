export const getUserTotalViews = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT COUNT(pv.id)::int AS total_views
      FROM posts p
      JOIN post_views pv ON pv.post_id = p.id
      WHERE p.user_id = $1
      `,
      [userId]
    );

    res.json({ totalViews: rows[0].total_views });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};