import express from "express";

import Order from "../models/Order.js";

import {
  verifyPrintifyWebhook,
  mapPrintifyStatus,
} from "../services/printifyWebhookService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signature =
      req.headers["x-printify-signature"];

    const isValid =
      verifyPrintifyWebhook(
        req.rawBody,
        signature,
        process.env.PRINTIFY_WEBHOOK_SECRET
      );

    if (!isValid) {
      console.warn(
        "Invalid Printify webhook signature."
      );

      return res.status(401).json({
        message:
          "Invalid webhook signature.",
      });
    }

    const event = req.body;

    console.log(
      "Printify webhook received:",
      event
    );

    const eventType =
      event?.type ||
      event?.event ||
      "";

    const printifyOrderId =
      event?.resource?.id ||
      event?.data?.id ||
      event?.order?.id ||
      event?.id ||
      null;

    if (!printifyOrderId) {
      console.warn(
        "Printify webhook does not contain an order ID."
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook received without order ID.",
      });
    }

    const order =
      await Order.findOne({
        printifyOrderId: String(
          printifyOrderId
        ),
      });

    if (!order) {
      console.warn(
        "No Vega order found for Printify order:",
        printifyOrderId
      );

      return res.status(200).json({
        success: true,
        message:
          "Webhook received. No matching Vega order.",
      });
    }

    // --------------------------------
    // ORDER STATUS
    // --------------------------------

    const printifyStatus =
      event?.resource?.status ||
      event?.data?.status ||
      event?.order?.status ||
      event?.status ||
      null;

    const mappedStatus =
      mapPrintifyStatus(
        printifyStatus
      );

    if (mappedStatus) {
      order.status = mappedStatus;
    }

    // --------------------------------
    // SHIPMENT / TRACKING
    // --------------------------------

    const shipment =
      event?.resource?.shipment ||
      event?.data?.shipment ||
      event?.shipment ||
      null;

    if (shipment) {
      order.tracking = {
        carrier:
          shipment.carrier ||
          shipment.shipping_carrier ||
          "",

        trackingNumber:
          shipment.number ||
          shipment.tracking_number ||
          "",

        trackingUrl:
          shipment.url ||
          shipment.tracking_url ||
          "",

        shippedAt:
          shipment.shipped_at
            ? new Date(
                shipment.shipped_at
              )
            : order.tracking?.shippedAt ||
              null,
      };

      if (
        order.status !==
          "delivered" &&
        order.status !==
          "cancelled"
      ) {
        order.status = "shipped";
      }
    }

    // --------------------------------
    // DELIVERY
    // --------------------------------

    if (
      eventType ===
        "order:shipment:delivered" ||
      eventType ===
        "shipment:delivered" ||
      eventType ===
        "order:delivered"
    ) {
      order.status = "delivered";
    }

    // --------------------------------
    // CANCELLATION
    // --------------------------------

    if (
      eventType ===
        "order:canceled" ||
      eventType ===
        "order:cancelled"
    ) {
      order.status = "cancelled";
    }

    await order.save();

    console.log(
      `Order ${order.orderNumber} updated: ${order.status}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Printify webhook processed.",
    });
  } catch (error) {
    console.error(
      "Printify webhook error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process Printify webhook.",
    });
  }
});

export default router;