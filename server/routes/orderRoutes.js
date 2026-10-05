import express from "express";

import Order from "../models/Order.js";

import {
  createPrintifyOrder,
  sendPrintifyOrderToProduction,
} from "../services/printifyService.js";

const router = express.Router();


// --------------------------------
// VALIDATE CUSTOMER
// --------------------------------

function validateCustomer(customer) {
  if (!customer) {
    return "Customer details are required.";
  }

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "city",
    "state",
    "postalCode",
  ];

  for (const field of requiredFields) {
    if (
      typeof customer[field] !== "string" ||
      !customer[field].trim()
    ) {
      return `${field} is required.`;
    }
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    !emailRegex.test(
      customer.email.trim()
    )
  ) {
    return "Invalid email address.";
  }

  const phoneDigits =
    customer.phone.replace(/\D/g, "");

  if (
    phoneDigits.length < 10 ||
    phoneDigits.length > 15
  ) {
    return "Invalid phone number.";
  }

  return null;
}


// --------------------------------
// GENERATE ORDER NUMBER
// --------------------------------

function generateOrderNumber() {
  return `VS-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}


// --------------------------------
// CREATE ORDER
// --------------------------------

router.post("/", async (req, res) => {
  try {
    const {
      customer,
      items,
      shipping = 0,
      paymentMethod = "razorpay",
    } = req.body;


    // ------------------------------
    // CUSTOMER VALIDATION
    // ------------------------------

    const customerError =
      validateCustomer(customer);

    if (customerError) {
      return res.status(400).json({
        message: customerError,
      });
    }


    // ------------------------------
    // ITEMS VALIDATION
    // ------------------------------

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        message:
          "Order must contain at least one item.",
      });
    }

    for (const item of items) {
      if (
        !item.productId ||
        !item.variantId ||
        !item.name
      ) {
        return res.status(400).json({
          message:
            "Invalid order item.",
        });
      }

      if (
        !Number.isInteger(
          Number(item.quantity)
        ) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({
          message:
            "Invalid item quantity.",
        });
      }

      if (
        typeof item.price !== "number" ||
        item.price < 0
      ) {
        return res.status(400).json({
          message:
            "Invalid item price.",
        });
      }
    }


    // ------------------------------
    // PAYMENT METHOD VALIDATION
    // ------------------------------

    if (
      !["razorpay", "cod"].includes(
        paymentMethod
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid payment method.",
      });
    }


    // ------------------------------
    // CALCULATE TOTALS ON SERVER
    // ------------------------------

    const calculatedSubtotal =
      items.reduce(
        (sum, item) =>
          sum +
          Number(item.price) *
            Number(item.quantity),
        0
      );

    const calculatedShipping =
      Number(shipping || 0);

    if (
      !Number.isFinite(
        calculatedShipping
      ) ||
      calculatedShipping < 0
    ) {
      return res.status(400).json({
        message:
          "Invalid shipping amount.",
      });
    }

    const calculatedTotal =
      calculatedSubtotal +
      calculatedShipping;


    // ------------------------------
    // PAYMENT STATUS
    // ------------------------------

    const isCOD =
      paymentMethod === "cod";


    // ------------------------------
    // CREATE MONGODB ORDER
    // ------------------------------

    let order;

    for (
      let attempt = 0;
      attempt < 3;
      attempt++
    ) {
      try {
        order = await Order.create({
          orderNumber:
            generateOrderNumber(),

          customer,

          items,

          subtotal:
            calculatedSubtotal,

          shipping:
            calculatedShipping,

          total:
            calculatedTotal,

          paymentMethod,

          paymentStatus: isCOD
            ? "cod_pending"
            : "pending",

          status: isCOD
            ? "processing"
            : "payment_pending",
        });

        break;
      } catch (error) {
        if (
          error.code !== 11000 ||
          attempt === 2
        ) {
          throw error;
        }
      }
    }


    // ------------------------------
    // SAFETY CHECK
    // ------------------------------

    if (!order) {
      return res.status(500).json({
        message:
          "Unable to create order.",
      });
    }


    // ------------------------------
    // RESPONSE
    // ------------------------------

    return res.status(201).json({
      success: true,

      message: isCOD
        ? "COD order created successfully."
        : "Order created successfully.",

      order,
    });
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to create order.",
    });
  }
});


// --------------------------------
// CREATE PRINTIFY ORDER
// --------------------------------

router.post(
  "/:orderNumber/printify",
  async (req, res) => {
    try {
      const { orderNumber } =
        req.params;

      const order =
        await Order.findOne({
          orderNumber,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Vega order not found.",
        });
      }


      // ------------------------------
      // PREVENT DUPLICATE PRINTIFY ORDER
      // ------------------------------

      if (order.printifyOrderId) {
        return res.json({
          success: true,

          message:
            "Printify order already exists.",

          printifyOrderId:
            order.printifyOrderId,

          order,
        });
      }


      // ------------------------------
      // RAZORPAY CHECK
      // ------------------------------

      if (
        order.paymentMethod ===
          "razorpay" &&
        order.paymentStatus !== "paid"
      ) {
        return res.status(400).json({
          message:
            "Razorpay order has not been paid.",
        });
      }


      // ------------------------------
      // COD CHECK
      // ------------------------------

      if (
        order.paymentMethod === "cod" &&
        order.paymentStatus !==
          "cod_pending"
      ) {
        return res.status(400).json({
          message:
            "COD order is not ready for Printify.",
        });
      }


      // ------------------------------
      // CREATE PRINTIFY ORDER
      // ------------------------------

      const printifyOrder =
        await createPrintifyOrder(
          order
        );

      const printifyOrderId =
        printifyOrder.id ||
        printifyOrder.data?.id;

      if (!printifyOrderId) {
        console.error(
          "Unexpected Printify response:",
          printifyOrder
        );

        return res.status(500).json({
          message:
            "Printify did not return an order ID.",
        });
      }


      // ------------------------------
      // SAVE PRINTIFY ORDER ID
      // ------------------------------

      order.printifyOrderId =
        String(printifyOrderId);

      order.status =
        "processing";

      await order.save();


      return res.status(201).json({
        success: true,

        message:
          "Printify order created successfully.",

        printifyOrderId:
          order.printifyOrderId,

        order,
      });
    } catch (error) {
      console.error(
        "Create Printify order error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        message:
          "Unable to create Printify order.",
      });
    }
  }
);


// --------------------------------
// SEND PRINTIFY ORDER TO PRODUCTION
// --------------------------------

router.post(
  "/:orderNumber/printify/production",
  async (req, res) => {
    try {
      const { orderNumber } =
        req.params;

      const order =
        await Order.findOne({
          orderNumber,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Vega order not found.",
        });
      }


      // ------------------------------
      // PRINTIFY ORDER CHECK
      // ------------------------------

      if (!order.printifyOrderId) {
        return res.status(400).json({
          message:
            "Printify order has not been created yet.",
        });
      }


      // ------------------------------
      // ALREADY IN PRODUCTION
      // ------------------------------

      if (
        order.status ===
        "in-production"
      ) {
        return res.json({
          success: true,

          message:
            "Order is already in production.",

          order,
        });
      }


      // ------------------------------
      // ALREADY PROGRESSED
      // ------------------------------

      if (
        order.status === "shipped" ||
        order.status === "delivered"
      ) {
        return res.status(400).json({
          message:
            "Order has already progressed beyond production.",
        });
      }


      // ------------------------------
      // SEND TO PRINTIFY PRODUCTION
      // ------------------------------

      const productionResult =
        await sendPrintifyOrderToProduction(
          order.printifyOrderId
        );

      console.log(
        "Printify production response:",
        productionResult
      );


      // ------------------------------
      // UPDATE ORDER
      // ------------------------------

      order.status =
        "in-production";

      await order.save();


      return res.json({
        success: true,

        message:
          "Printify order sent to production.",

        printifyOrderId:
          order.printifyOrderId,

        order,
      });
    } catch (error) {
      console.error(
        "Send to Printify production error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        message:
          "Unable to send order to production.",
      });
    }
  }
);


// --------------------------------
// GET ORDER BY ORDER NUMBER
// --------------------------------

router.get(
  "/:orderNumber",
  async (req, res) => {
    try {
      const { orderNumber } =
        req.params;

      const order =
        await Order.findOne({
          orderNumber,
        });

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found.",
        });
      }

      return res.json({
        success: true,
        order,
      });
    } catch (error) {
      console.error(
        "Get order error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to retrieve order.",
      });
    }
  }
);


export default router;