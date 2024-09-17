const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const fastCsv = require("fast-csv");
const { v4: uuidv4 } = require("uuid");

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
    const products = await readCSV();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error reading CSV file" });
  }
}

// Create a new record
async function addProduct(req, res) {
  console.log("add prod");
  try {
    const products = await readCSV();
    const newProduct = req.body;

    products.unshift(newProduct);
    console.log(newProduct);
    await writeCSV(products);
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error writing to CSV file" });
  }
}

// Update a record by ID
async function updateProduct(req, res) {
  console.log(req.params.id);
  try {
    const products = await readCSV();
    const productIndex = products.findIndex(
      (product) => product.ProdID === req.params.id
    );
    console.log(productIndex);
    if (productIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }
    products[productIndex] = { ...products[productIndex], ...req.body };
    await writeCSV(products);
    res.status(200).json(products[productIndex]);
    console.log("edited");
  } catch (error) {
    res.status(500).json({ error: "Error updating CSV file" });
  }
}

// Delete a record by ID
async function deleteProduct(req, res) {
  console.log("delete triggered");
  console.log(req.params.id);
  try {
    const products = await readCSV();
    const filteredProducts = products.filter(
      (product) => product.ProdID !== req.params.id
    );
    if (products.length === filteredProducts.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    await writeCSV(filteredProducts);
    res.status(200).json({ message: "Product deleted successfully" });
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
