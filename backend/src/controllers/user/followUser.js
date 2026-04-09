import pool from "../../db.js";

export const followUser = async (req, res) => {
  try {
    const followerId = req.user.userId;
    const { username } = req.params;

    const user = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1)",
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const targetUserId = user.rows[0].id;

    if (targetUserId === followerId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const result = await pool.query(
      `
      INSERT INTO follows (follower_id, following_id)
      VALUES ($1, $2)
      ON CONFLICT (follower_id, following_id) DO NOTHING
      RETURNING id
      `,
      [followerId, targetUserId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "You already follow this user" });
    }

    res.json({ message: "Followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};