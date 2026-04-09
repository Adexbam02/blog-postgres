import pool from "../../db.js";

export const mostLike = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        posts.id,
        posts.slug,
        posts.title,
        posts.category,
        posts.author,
        users.profile_picture_url,
        posts.created_at,
        posts.img_url,
        COUNT(likes.id)::int AS like_count
      FROM posts
      LEFT JOIN likes ON posts.id = likes.post_id
      LEFT JOIN users ON posts.user_id = users.id
      GROUP BY posts.id, users.profile_picture_url
      ORDER BY like_count DESC, posts.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching most liked posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};