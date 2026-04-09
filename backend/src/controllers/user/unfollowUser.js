import pool from "../../db.js";

export const unfollowUser = async (req, res) => {
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

    const deleteResult = await pool.query(
      `
      DELETE FROM follows
      WHERE follower_id = $1 AND following_id = $2
      RETURNING id
      `,
      [followerId, targetUserId]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(400).json({ message: "You do not follow this user" });
    }

    // 📊 Track unfollow history
    await pool.query(
      `
      INSERT INTO unfollows (follower_id, following_id)
      VALUES ($1, $2)
      `,
      [followerId, targetUserId]
    );

    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};