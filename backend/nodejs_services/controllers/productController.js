const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");

const CSV_FILE_PATH = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "models",
  "cleaned_data.csv"
);

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
async function getProducts(req, res) {
  try {
    const users = await readCSV();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error reading CSV file" });
  }
}

// Create a new record
async function addProduct(req, res) {
  try {
    const users = await readCSV();
    const newUser = { id: String(users.length + 1), ...req.body };
    users.unshift(newUser);
    await writeCSV(users);
    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error writing to CSV file" });
  }
}

// Update a record by ID
async function updateProduct(req, res) {
  try {
    const users = await readCSV();
    const userIndex = users.findIndex((user) => user.ID === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    users[userIndex] = { ...users[userIndex], ...req.body };
    await writeCSV(users);
    res.status(200).json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ error: "Error updating CSV file" });
  }
}

// Delete a record by ID
async function deleteProduct(req, res) {
  console.log("delete triggered");
  console.log(req.params.id);
  try {
    const users = await readCSV();
    const filteredUsers = users.filter((user) => user.ID !== req.params.id);
    if (users.length === filteredUsers.length) {
      return res.status(404).json({ error: "User not found" });
    }
    await writeCSV(filteredUsers);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting from CSV file" });
  }
}

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};
