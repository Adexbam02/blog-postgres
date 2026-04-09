import pool from "../../db.js";

export const getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await pool.query(
      `
      SELECT id, username, email, bio, profile_picture_url, banner_picture_url
      FROM users
      WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user.rows[0].id;

    const posts = await pool.query(
      `
      SELECT 
        p.id,
        p.slug,
        p.title,
        p.category,
        p.content,
        p.img_url,
        p.created_at,
        COUNT(l.id)::int AS like_count
      FROM posts p
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [userId]
    );

    res.json({
      ...user.rows[0],
      posts: posts.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};