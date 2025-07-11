const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./database"); // ✅ import database connection

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Save contact form message to SQLite
app.post("/api/contact", (req, res) => {
  const { name, phone, email, message } = req.body;
  console.log("📩 New Contact Message:", req.body);

  db.run(
    `INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)`,
    [name, phone, email, message],
    function (err) {
      if (err) {
        console.error("❌ DB Insert Error:", err.message);
        return res.status(500).json({ success: false, message: "Database error" });
      }
      res.status(200).json({ success: true, message: "Message stored successfully!" });
    }
  );
});

// ✅ Optional: Get all messages from SQLite
app.get("/api/messages", (req, res) => {
  db.all(`SELECT * FROM contacts ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to fetch messages" });
    }
    res.json(rows);
  });
});

// Serve frontend from dist
app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
