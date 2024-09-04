// index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes.js");

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
