import pool from "../../db.js";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const createPost = async (req, res) => {
  const { title, content, author, category, img_url } = req.body;
  const userId = req.user?.userId;

  try {
    if (!title || !content || !author || !category || !img_url) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let slug = createSlug(title);

    // 🔁 Ensure slug is unique
    const slugCheck = await pool.query(
      "SELECT id FROM posts WHERE slug = $1",
      [slug]
    );

    if (slugCheck.rows.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    const { rows } = await pool.query(
      `
      INSERT INTO posts (user_id, title, content, author, category, img_url, slug, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
      RETURNING id, slug
      `,
      [userId, title, content, author, category, img_url, slug]
    );

    res.status(201).json({
      message: "Post created successfully",
      post: rows[0],
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};