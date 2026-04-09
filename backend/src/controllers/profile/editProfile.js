import pool from "../../db.js";

export const editProfile = async (req, res) => {
  const { username } = req.user; // from JWT
  const {
    username: newUsername,
    bio,
    email,
    profile_picture_url,
    banner_picture_url,
  } = req.body;

  try {
    // 🔍 Check if user exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // ⚠️ Optional: prevent duplicate username/email
    if (newUsername && newUsername !== username) {
      const checkUsername = await pool.query(
        "SELECT id FROM users WHERE username = $1",
        [newUsername]
      );

      if (checkUsername.rows.length > 0) {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    if (email) {
      const checkEmail = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND username != $2",
        [email, username]
      );

      if (checkEmail.rows.length > 0) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    // ✨ Update profile
    const result = await pool.query(
      `
      UPDATE users
      SET
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        email = COALESCE($3, email),
        profile_picture_url = COALESCE($4, profile_picture_url),
        banner_picture_url = COALESCE($5, banner_picture_url)
      WHERE username = $6
      RETURNING id, username, email, bio, profile_picture_url, banner_picture_url
      `,
      [
        newUsername || null,
        bio ?? null,
        email || null,
        profile_picture_url ?? null,
        banner_picture_url ?? null,
        username,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Edit profile error:", error);

    // 🔥 Handle unique constraint errors (Postgres)
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};