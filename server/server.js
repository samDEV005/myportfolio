
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
    ],
  })
);

app.use(express.json({ limit: "10kb" }));

// MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || "myportfolio-mysql",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "portfolio_user",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "myportfolio",
  waitForConnections: true,
  connectionLimit: 10,
});

// Check API and database
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      message: "Portfolio API is running",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error.message);

    res.status(503).json({
      message: "MySQL connection failed",
      database: "disconnected",
    });
  }
});

// Retrieve comments
app.get("/api/comments", async (req, res) => {
  try {
    const [comments] = await pool.execute(`
      SELECT id, name, comment, created_at
      FROM comments
      ORDER BY created_at DESC, id DESC
      LIMIT 200
    `);

    res.json(comments);
  } catch (error) {
    console.error("Fetching comments failed:", error.message);
    res.status(500).json({ error: "Could not fetch comments" });
  }
});

// Save a comment
app.post("/api/comments", async (req, res) => {
  try {
    const name =
      typeof req.body.name === "string"
        ? req.body.name.trim()
        : "";

    const comment =
      typeof req.body.comment === "string"
        ? req.body.comment.trim()
        : "";

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({
        error: "Name must be between 2 and 60 characters",
      });
    }

    if (comment.length < 3 || comment.length > 1000) {
      return res.status(400).json({
        error: "Comment must be between 3 and 1000 characters",
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO comments (name, comment) VALUES (?, ?)",
      [name, comment]
    );

    const [rows] = await pool.execute(
      `SELECT id, name, comment, created_at
       FROM comments
       WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Saving comment failed:", error.message);
    res.status(500).json({ error: "Could not save comment" });
  }
});

// Create the table and start the server
async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query("SELECT 1");

    app.listen(PORT, "0.0.0.0", () => {
      console.log("Connected to MySQL");
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
