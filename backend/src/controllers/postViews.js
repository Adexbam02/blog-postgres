import pool from "../db.js";

export const postView = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.userId ?? null;
  const visitorId = req.body?.visitorId ?? null;

  if (!userId && !visitorId) {
    return res.status(400).json({ error: "Missing viewer identity" });
  }

  try {
    let existing;

    if (userId) {
      // 🔐 Logged-in users → 2 min cooldown
      const result = await pool.query(
        `
        SELECT 1 
        FROM post_views
        WHERE post_id = $1
        AND user_id = $2
        AND viewed_at > NOW() - INTERVAL '2 minutes'
        `,
        [postId, userId]
      );

      existing = result.rows.length > 0;
    } else {
      // 🌐 Visitors → 24h cooldown
      const result = await pool.query(
        `
        SELECT 1 
        FROM post_views
        WHERE post_id = $1
        AND visitor_id = $2
        AND viewed_at > NOW() - INTERVAL '24 hours'
        `,
        [postId, visitorId]
      );

      existing = result.rows.length > 0;
    }

    if (existing) {
      return res.json({ message: "View already recorded" });
    }

    await pool.query(
      `
      INSERT INTO post_views (post_id, user_id, visitor_id)
      VALUES ($1, $2, $3)
      `,
      [postId, userId, visitorId]
    );

    res.status(201).json({ message: "View recorded" });
  } catch (err) {
    console.error("Post view error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};