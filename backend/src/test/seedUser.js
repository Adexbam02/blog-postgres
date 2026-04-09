import pool from "../db.js";
import bcrypt from "bcrypt";

const users = [
  { username: "West", email: "west@gmail.com", password: "3uewoi;okliughfgjko98" },
  { username: "Aisha", email: "aisha.dev@example.com", password: "V7r!9pXk#q2LmN" },
  { username: "Tunde", email: "tunde88@example.com", password: "tUnD3@2025_secure" },
  { username: "Chioma", email: "chioma.art@example.com", password: "C!h0ma_&Design9" },
  { username: "Emeka", email: "emeka.tech@example.com", password: "Em3kA#Builds_42" },
];

const seed = async () => {
  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool.query(
        `INSERT INTO users (username, email, password)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO NOTHING`,
        [user.username, user.email, hashedPassword]
      );
    }

    console.log("✅ Users seeded successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();