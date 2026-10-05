import express from "express";
import {
  getShopDetails,
  getProducts,
} from "../services/printifyService.js";

const router = express.Router();

router.get("/shops", async (req, res) => {
  try {
    const shops = await getShopDetails();

    res.status(200).json({
      success: true,
      data: shops,
    });
  } catch (error) {
    console.error(
      "Printify shop error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to connect to Printify",
    });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await getProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error(
      "Printify product error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch products from Printify",
    });
  }
});

export default router;