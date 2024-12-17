const express = require("express");
const {
  getAllProducts,
  getCategories,
  getProductsByCategory,
  getProductById,
} = require("../controllers/woo");
const router = express.Router();

router.get("/test-endpoint", async (req, res) => {
  try {
    res.json({ message: "Connection Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/woo-get-categories", async (req, res) => {
  try {
    getCategories();
    res.json({ message: "Categories received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/woo-get-prod-by-id", async (req, res) => {
  try {
    getProductById(13934);
    res.json({ message: "Product data received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/woo-get-prod-data", async (req, res) => {
  try {
    getAllProducts();
    res.json({ message: "Request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/woo-get-prod-by-cat", async (req, res) => {
  try {
    getProductsByCategory(158);
    res.json({ message: "Request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/inventory-update", async (req, res) => {
  try {
    const item = req.body;
    const itemName = item.name;
    const itemSKU = item.sku;
    const quantity = item.quantityOnHand;

    console.log(itemName + " has " + quantity + " on hand.");

    res.status(200).send("Request Received");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
