import pool from "../../db.js";

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

export const editPost = async (req, res) => {
  const { postId } = req.params;
  const { title, content, author, category, img_url } = req.body;
  const userId = req.user?.userId;

  try {
    const existing = await pool.query(
      "SELECT title FROM posts WHERE id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existing.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Post not found or not authorized" });
    }

    const oldTitle = existing.rows[0].title;

    const slug =
      title && title !== oldTitle ? createSlug(title) : null;

    await pool.query(
      `
      UPDATE posts SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        author = COALESCE($3, author),
        category = COALESCE($4, category),
        img_url = COALESCE($5, img_url),
        slug = COALESCE($6, slug),
        updated_at = NOW()
      WHERE id = $7 AND user_id = $8
      `,
      [
        title || null,
        content || null,
        author || null,
        category || null,
        img_url || null,
        slug,
        postId,
        userId,
      ]
    );

    res.json({ message: "Post updated successfully" });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};