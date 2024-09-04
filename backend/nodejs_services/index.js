// index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;
const CSV_FILE_PATH = path.join(
  __dirname,
  "..",
  "..",
  "models",
  "cleaned_data.csv"
);

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

// Helper function to read CSV file
function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(CSV_FILE_PATH)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

// Helper function to write to CSV file
function writeCSV(data) {
  return new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(CSV_FILE_PATH);
    fastCsv
      .write(data, { headers: true })
      .pipe(ws)
      .on("finish", resolve)
      .on("error", reject);
  });
}

// Read all records
app.get("/users", async (req, res) => {
  try {
    const users = await readCSV();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error reading CSV file" });
  }
});

// Create a new record
app.post("/users", async (req, res) => {
  try {
    const users = await readCSV();
    const newUser = { id: String(users.length + 1), ...req.body };
    users.unshift(newUser);
    await writeCSV(users);
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error writing to CSV file" });
  }
});

// Update a record by ID
app.put("/users/:id", async (req, res) => {
  try {
    const users = await readCSV();
    const userIndex = users.findIndex((user) => user.ID === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...req.body };
    await writeCSV(users);
    res.json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: "Error updating CSV file" });
  }
});

// Delete a record by ID
app.delete("/users/:id", async (req, res) => {
  console.log("delete triggered");
  console.log(req.params.id);
  try {
    const users = await readCSV();
    const filteredUsers = users.filter((user) => user.ID !== req.params.id);
    if (users.length === filteredUsers.length) {
      return res.status(404).json({ error: "User not found" });
    }
    await writeCSV(filteredUsers);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting from CSV file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
