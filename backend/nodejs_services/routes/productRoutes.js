const express = require("express");
const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { authenticateToken, roleAdmin } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticateToken, roleAdmin, getProducts);
router.post("/", authenticateToken, roleAdmin, addProduct);
router.put("/:id", authenticateToken, roleAdmin, updateProduct);
router.delete("/:id", authenticateToken, roleAdmin, deleteProduct);

module.exports = router;
