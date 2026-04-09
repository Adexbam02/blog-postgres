import pool from "../../db.js";

export const getUserProfilePublic = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await pool.query(
      `
      SELECT id, username, bio, profile_picture_url, banner_picture_url
      FROM users
      WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.rows[0].id;

    const followers = await pool.query(
      `SELECT COUNT(*)::int FROM follows WHERE following_id = $1`,
      [userId]
    );

    const following = await pool.query(
      `SELECT COUNT(*)::int FROM follows WHERE follower_id = $1`,
      [userId]
    );

    let isFollowing = false;

    if (req.user?.userId) {
      const check = await pool.query(
        `
        SELECT 1 FROM follows
        WHERE follower_id = $1 AND following_id = $2
        `,
        [req.user.userId, userId]
      );

      isFollowing = check.rows.length > 0;
    }

    res.json({
      ...user.rows[0],
      followers: followers.rows[0].count,
      following: following.rows[0].count,
      isFollowing,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};