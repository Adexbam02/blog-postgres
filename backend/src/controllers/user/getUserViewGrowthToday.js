export const getUserTotalViewsInLastOneHr = async (req, res) => {
  const { userId } = req.params;

  try {
    const { rows } = await pool.query(
      `
      SELECT COUNT(pv.id)::int AS total
      FROM posts p
      JOIN post_views pv ON pv.post_id = p.id
      WHERE p.user_id = $1
      AND pv.viewed_at >= NOW() - INTERVAL '30 minutes'
      `,
      [userId]
    );

    res.json({ totalViewsInLastOneHr: rows[0].total });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};