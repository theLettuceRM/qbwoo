require("dotenv").config();
const axios = require("axios");
const { response } = require("express");

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
      variations: product.variations,
    }));

    console.log(productInfo);
  } catch (error) {
    console.error("Error fetching Products by category.", error.message);
  }
};

const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`, {
      auth: {
        username: CONSUMER_KEY,
        password: CONSUMER_SECRET,
      },
    });

    const product = response.data;
    const productInfo = {
      id: product.id,
      name: product.name,
      sku: product.sku,
      variations: product.variations,
    };
    console.log(productInfo);

    const productId = product.id;
    const productName = product.name;
    const productSku = product.sku;
    const productVariations = product.variations;

    if (productVariations && productVariations.length > 0) {
      console.log("This product has variations");

      const variationPromises = productVariations.map((variationId) => {
        console.log(`Preparing to fetch details for variation ID: ${variationId}`);
        return getVariationInfo(productId, variationId);
      });

      await Promise.all(variationPromises);
      console.log("received all variation info.");
    } else {
      console.log("This product does not have variations");
    }
  } catch (error) {
    console.error("Error fetching product.", error.message);
  }
};

const getVariationInfo = async (prodId, varId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${prodId}/variations/${varId}`, {
        auth: {
          username: CONSUMER_KEY,
          password: CONSUMER_SECRET,
        },
      }
    );

    const variation = response.data;
    const variationInfo = {
      id: variation.id,
      sku: variation.sku,
      stock: variation.stock_quantity,
    };

    console.log(variationInfo);
    return variationInfo;
  } catch (error) {
    console.error("Error fetching variation.", error.message);
  }
};

const getAllProducts = async () => {
  try {
    let products = [];
    let page = 1;

    // Fetch products in pages
    while (true) {
      console.log(`Fetching page ${page}...`);

      const response = await axios.get(`${API_URL}/products`, {
        params: {
          consumer_key: CONSUMER_KEY,
          consumer_secret: CONSUMER_SECRET,
          per_page: 100, // Fetch 100 products per page (max allowed)
          page, // Current page number
        },
      });

      // Add the current page's products to the list
      products.push(...response.data);

      // Check if we've fetched all pages
      if (response.data.length < 100) break;

      page++;
    }

    console.log("Total products fetched:", products.length);

    // TODO: Push simple products to DB

    // TODO: Get variation info for variable products

    const productData = products.map((product) => ({
      id: product.id,
      sku: product.sku,
      variations: product.variations,
    }));
    // console.log(productData);

    let simpleProducts = [];
    let variableProducts = [];

    simpleProducts = productData.filter( (product) => product.variations.length == 0 );
    variableProducts = productData.filter( (product) => product.variations && product.variations.length > 0 );
    console.log("Total variable products:", variableProducts.length);
    console.log("Total simple products:", simpleProducts.length);
    // console.table(variableProducts);

  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
  }
};

module.exports = {
  getCategories,
  getProductsByCategory,
  getProductById,
  getAllProducts,
};
