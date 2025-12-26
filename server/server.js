const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ================= USERS RESOURCE =================

// In-memory users
let users = [];
let nextUserId = 1;

/**
 * GET all users
 */
app.get("/api/users", (req, res) => {
  res.status(200).json(users);
});

/**
 * GET user by id
 */
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

/**
 * CREATE user
 */
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newUser = {
    id: nextUserId++,
    name,
    email: email || "",
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * DELETE user
 */
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(index, 1);
  res.status(204).send();
});
// Root route
// In-memory data (mock database)
let records = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});
/**
 * GET all records
 */
app.get("/api/records", (req, res) => {
  res.status(200).json(records);
});

/**
 * GET record by id
 */
app.get("/api/records/:id", (req, res) => {
  const id = Number(req.params.id);
  const record = records.find((r) => r.id === id);

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  res.status(200).json(record);
});

/**
 * CREATE new record
 */
app.post("/api/records", (req, res) => {
  const { title, description } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({
      error: "Title is required and must be at least 3 characters",
    });
  }

  const newRecord = {
    id: nextId++,
    title,
    description: description || "",
  };

  records.push(newRecord);
  res.status(201).json(newRecord);
});

/**
 * UPDATE record
 */
app.put("/api/records/:id", (req, res) => {
  const id = Number(req.params.id);
  const record = records.find((r) => r.id === id);

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  const { title, description } = req.body;

  if (!title || title.length < 3) {
    return res.status(400).json({
      error: "Title is required and must be at least 3 characters",
    });
  }

  record.title = title;
  record.description = description || "";

  res.status(200).json(record);
});

/**
 * DELETE record
 */
app.delete("/api/records/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = records.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Record not found" });
  }

  records.splice(index, 1);
  res.status(204).send();
});

/**
 * Test endpoint
 */
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
