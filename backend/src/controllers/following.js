import pool from "../db.js";

export const getFollowingStatus = async (req, res) => {
  try {
    const { username } = req.params;
    const followerId = req.user?.userId;

    if (!followerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔍 Get target user
    const userResult = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUserId = userResult.rows[0].id;

    // 🔎 Check follow status
    const followResult = await pool.query(
      `
      SELECT 1 
      FROM follows 
      WHERE follower_id = $1 AND following_id = $2
      `,
      [followerId, targetUserId]
    );

    res.json({ isFollowing: followResult.rows.length > 0 });
  } catch (error) {
    console.error("Following status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};