import pool from "../../db.js";

export const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user?.userId;

  console.log("Delete Post Request:", { postId, userId });

  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const post = await pool.query(
      "SELECT user_id FROM posts WHERE id = $1",
      [postId]
    );

    if (post.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to delete this post",
      });
    }

    await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2",
      [postId, userId]
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};