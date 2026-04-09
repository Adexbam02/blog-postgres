import db from "../../db.js";

export const deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user?.userId;

  console.log("Delete Comment Request:", { commentId, userId });

  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { rows } = await db.query("SELECT user_id FROM comments WHERE id = $1", [commentId]);
    const comment = rows[0];

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        error: "Forbidden: You are not authorized to delete this comment",
      });
    }

    await db.query("DELETE FROM comments WHERE id = $1 AND user_id = $2", [
      commentId,
      userId
    ]);

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};