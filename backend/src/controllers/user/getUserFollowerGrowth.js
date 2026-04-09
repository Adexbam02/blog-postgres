import pool from "../../db.js";

export const getUserFollowerGrowth = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await pool.query(
      `SELECT id, username FROM users WHERE LOWER(username) = LOWER($1)`,
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.rows[0].id;

    const totalFollowers = await pool.query(
      `SELECT COUNT(*)::int AS count FROM follows WHERE following_id = $1`,
      [userId]
    );

    const gained = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM follows
      WHERE following_id = $1
      AND created_at >= NOW() - INTERVAL '30 minutes'
      `,
      [userId]
    );

    const lost = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM unfollows
      WHERE following_id = $1
      AND unfollowed_at >= NOW() - INTERVAL '30 minutes'
      `,
      [userId]
    );

    const total = totalFollowers.rows[0].count;
    const gainedCount = gained.rows[0].count;
    const lostCount = lost.rows[0].count;

    const net = gainedCount - lostCount;
    const previous = total - gainedCount + lostCount;

    const growth =
      previous > 0 ? ((net / previous) * 100).toFixed(2) : 0;

    const lostPercent =
      previous > 0 ? ((lostCount / previous) * 100).toFixed(2) : 0;

    res.json({
      id: userId,
      username: user.rows[0].username,
      followers: total,
      followersGainedLast30Minutes: gainedCount,
      followersLostLast30Minutes: lostCount,
      netFollowersChange: net,
      followersGrowthPercentage: Number(growth),
      followersLostPercentage: Number(lostPercent),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};