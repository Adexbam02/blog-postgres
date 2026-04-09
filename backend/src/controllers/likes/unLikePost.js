import pool from "../../db.js";

export const unLikePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { postId } = req.params;

    const result = await pool.query(
      `
      DELETE FROM likes
      WHERE user_id = $1 AND post_id = $2
      RETURNING id
      `,
      [userId, postId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "You have not liked this post",
      });
    }

    return res.json({ message: "Like removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};