require("dotenv").config();
const axios = require("axios");
const { response } = require("express");

// WooCommerce REST API credentials
const API_URL = process.env.WC_API_URL;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/categories`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
    });

    const categories = response.data;

    const categoryInfo = categories.map((category) => ({
      id: category.id,
      name: category.name,
      productCount: category.count,
    }));

    console.log(categoryInfo);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
  }
};

const getProductsByCategory = async (id) => {

  try {
    const response = await axios.get(`${API_URL}/products?category=${id}`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
    });

    const products = response.data;
    const productInfo = products.map((product) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
    }));

    console.log(productInfo);

  } catch (error) {
    console.error("Error fetching Products by category.", error.message);
  }
};

const getAllProducts = async () => {
  try {
    let products = [];
    let page = 1;

    while (true) {
      console.log(`Fetching page ${page}...`);

      // Make a GET request to fetch products
      const response = await axios.get(`${API_URL}/products`, {
        params: {
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
          per_page: 100, // Fetch 100 products per page (max allowed)
          page, // Current page number
        },
      });

      // Add the current page's products to the list
      products = products.concat(response.data);

      // Check if we've fetched all pages
      if (response.data.length < 100) break;

      page++;
    }

    // Extract IDs and SKUs
    const productData = products.map((product) => ({
      id: product.id,
      sku: product.sku || null, // Some products may not have SKUs
    }));

    console.log("Total products fetched:", productData.length);
    return productData;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
  }
};

module.exports = { getCategories, getProductsByCategory, getAllProducts };

// Fetch products
// getAllProducts();
