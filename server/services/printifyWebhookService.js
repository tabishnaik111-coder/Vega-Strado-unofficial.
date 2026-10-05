import crypto from "crypto";

function verifyPrintifyWebhook(
  rawBody,
  signature,
  secret
) {
  if (!rawBody || !signature || !secret) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const receivedBuffer = Buffer.from(
    signature,
    "utf8"
  );

  const expectedBuffer = Buffer.from(
    expectedSignature,
    "utf8"
  );

  if (
    receivedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedBuffer,
    expectedBuffer
  );
}

function mapPrintifyStatus(status) {
  const statusMap = {
    "on-hold": "processing",

    "payment-not-received":
      "payment_pending",

    "sending-to-production":
      "processing",

    "in-production":
      "in-production",

    fulfilled: "shipped",

    "partially-fulfilled":
      "shipped",

    canceled: "cancelled",

    cancelled: "cancelled",
  };

  return (
    statusMap[status] || null
  );
}

export {
  verifyPrintifyWebhook,
  mapPrintifyStatus,
};