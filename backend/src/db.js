// import { DatabaseSync } from "node:sqlite";
// import { dirname, join } from "node:path";
// import { fileURLToPath } from "node:url";
// import fs from "node:fs";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// // make sure the 'data' directory exists
// const dataDir = join(__dirname, "data");
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true });
// }

// // use absolute path to database file
// const dbPath = join(dataDir, "database.sqlite");
// const db = new DatabaseSync(dbPath);

// db.exec("PRAGMA foreign_keys = ON;");

// db.exec(`
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     username TEXT NOT NULL UNIQUE,
//     email TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS posts (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     title TEXT NOT NULL,
//     content TEXT NOT NULL,
//     author TEXT NOT NULL,
//     category TEXT NOT NULL,
//     img_url TEXT NOT NULL,
//     slug TEXT NOT NULL UNIQUE,
//     likes INTEGER DEFAULT 0, 
//     status TEXT CHECK(status IN ('draft', 'published')) NOT NULL DEFAULT 'draft',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS post_views (
//    id INTEGER PRIMARY KEY AUTOINCREMENT,
//     post_id INTEGER NOT NULL,
//     user_id INTEGER,
//     visitor_id TEXT,
//     viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,

//     CHECK (
//       (user_id IS NOT NULL AND visitor_id IS NULL)
//       OR
//       (user_id IS NULL AND visitor_id IS NOT NULL)
//     ),
//   FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
//   );
// `);

// db.prepare(
//   `
//   CREATE INDEX IF NOT EXISTS idx_post_views_post_time
//   ON post_views(post_id, viewed_at)
// `,
// ).run();

// db.exec(`
//  CREATE TABLE IF NOT EXISTS likes (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   user_id INTEGER NOT NULL,
//   post_id INTEGER NOT NULL,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE(user_id, post_id),
//   FOREIGN KEY (user_id) REFERENCES users(id),
//   FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE

// );

// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS follows (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     follower_id INTEGER NOT NULL,
//     following_id INTEGER NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(follower_id, following_id),
//     FOREIGN KEY (follower_id) REFERENCES users(id),
//     FOREIGN KEY (following_id) REFERENCES users(id)
//   );
// `);

// db.exec(`
//    CREATE TABLE IF NOT EXISTS unfollows (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     follower_id INTEGER NOT NULL,
//     following_id INTEGER NOT NULL,
//     unfollowed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (follower_id) REFERENCES users(id),
//     FOREIGN KEY (following_id) REFERENCES users(id),
//     UNIQUE (follower_id, following_id)
//   );
// `);

// db.exec(`
//   CREATE TABLE IF NOT EXISTS comments  (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     user_id INTEGER NOT NULL,
//     post_id INTEGER NOT NULL,
//     content TEXT NOT NULL,
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id),
//     FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
//   );
// `);

// export default db;



import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "blog_db",
  password: "1234", // change this
  port: 5432,
});

// Initialize tables
export const initDB = async () => {
  try {
    // USERS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        bio TEXT,
        profile_picture_url TEXT,
        banner_picture_url TEXT
      );
    `);

    // Backwards compatibility for existing local database:
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_url TEXT`);
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS banner_picture_url TEXT`);

    // POSTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        img_url TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        likes INTEGER DEFAULT 0,
        status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // POST VIEWS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_views (
        id SERIAL PRIMARY KEY,
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        visitor_id TEXT,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (
          (user_id IS NOT NULL AND visitor_id IS NULL)
          OR
          (user_id IS NULL AND visitor_id IS NOT NULL)
        )
      );
    `);

    // INDEX
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_post_views_post_time
      ON post_views(post_id, viewed_at);
    `);

    // LIKES
    await pool.query(`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, post_id)
      );
    `);

    // FOLLOWS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS follows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER NOT NULL REFERENCES users(id),
        following_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      );
    `);

    // UNFOLLOWS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS unfollows (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER NOT NULL REFERENCES users(id),
        following_id INTEGER NOT NULL REFERENCES users(id),
        unfollowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      );
    `);

    // COMMENTS
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ PostgreSQL tables initialized");
  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};

export default pool;