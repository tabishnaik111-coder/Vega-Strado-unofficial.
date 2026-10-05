import express from "express";
import crypto from "crypto";

import Order from "../models/Order.js";
import { createRazorpayOrder } from "../services/razorpayService.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const paymentLimiter =
  rateLimit({
    windowMs:
      10 * 60 * 1000,

    max: 30,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      message:
        "Too many payment requests. Please try again later.",
    },
  });

// CREATE RAZORPAY ORDER
router.post(
  "/create-order",
  paymentLimiter,
  async (req, res) => {
  try {
    const { orderNumber } = req.body;

    if (!orderNumber) {
      return res.status(400).json({
        message: "Order number is required.",
      });
    }

    const order = await Order.findOne({
      orderNumber,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentMethod !== "razorpay") {
      return res.status(400).json({
        message:
          "This order is not configured for Razorpay.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "This order has already been paid.",
      });
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: order.total,
      receipt: order.orderNumber,
    });

    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res.json({
      success: true,

      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },

      keyId: process.env.RAZORPAY_KEY_ID,

      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error(
      "Razorpay create order error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create Razorpay order.",
    });
  }
});

// VERIFY RAZORPAY PAYMENT
router.post(
  "/verify",
  paymentLimiter,
  async (req, res) => {
  try {
    const {
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderNumber ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message:
          "Payment verification details are required.",
      });
    }

    const order = await Order.findOne({
      orderNumber,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentMethod !== "razorpay") {
      return res.status(400).json({
        message:
          "This order is not configured for Razorpay.",
      });
    }

    if (
      order.razorpayOrderId !==
      razorpay_order_id
    ) {
      return res.status(400).json({
        message:
          "Razorpay order does not match Vega order.",
      });
    }

    if (order.paymentStatus === "paid") {
      return res.json({
        success: true,

        message:
          "Payment was already verified.",

        order: {
          orderNumber:
            order.orderNumber,

          paymentMethod:
            order.paymentMethod,

          paymentStatus:
            order.paymentStatus,

          status: order.status,
        },
      });
    }

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_KEY_SECRET
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const isSignatureValid =
      generatedSignature ===
      razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        message:
          "Payment signature verification failed.",
      });
    }

    // ONLINE PAYMENT COMPLETED
    order.razorpayPaymentId =
      razorpay_payment_id;

    order.paymentStatus = "paid";

    order.status = "paid";

    await order.save();

    return res.json({
      success: true,

      message:
        "Payment verified successfully.",

      order: {
        orderNumber:
          order.orderNumber,

        paymentMethod:
          order.paymentMethod,

        paymentStatus:
          order.paymentStatus,

        status: order.status,
      },
    });
  } catch (error) {
    console.error(
      "Razorpay verification error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to verify payment.",
    });
  }
});

export default router;