import express from "express";

import {
  getFormattedProducts,
  getFormattedProductById,
  filterProducts,
  getCategories,
  getAvailableSizes,
  getAvailableColors,
} from "../services/productService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await getFormattedProducts();

    const filteredProducts = filterProducts(
      products,
      req.query
    );

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      data: filteredProducts,
    });
  } catch (error) {
    console.error(
      "Product API error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch products",
    });
  }
});

router.get("/filters/options", async (req, res) => {
  try {
    const products = await getFormattedProducts();

    res.status(200).json({
      success: true,
      data: {
        categories: getCategories(products),
        sizes: getAvailableSizes(products),
        colors: getAvailableColors(products),
      },
    });
  } catch (error) {
    console.error(
      "Filter options error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch filter options",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await getFormattedProductById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(
      "Product detail API error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch product",
    });
  }
});

export default router;