import axios from "axios";

const PRINTIFY_API_URL =
  "https://api.printify.com/v1";

const printifyApi = axios.create({
  baseURL: PRINTIFY_API_URL,

  headers: {
    Authorization: `Bearer ${process.env.PRINTIFY_API_KEY}`,
    "Content-Type": "application/json",
    "User-Agent": "Vega-Strado",
  },
});

// GET SHOP DETAILS
async function getShopDetails() {
  const response = await printifyApi.get(
    "/shops.json"
  );

  return response.data;
}

// GET PRODUCTS
async function getProducts() {
  if (!process.env.PRINTIFY_SHOP_ID) {
    throw new Error(
      "PRINTIFY_SHOP_ID is missing"
    );
  }

  const response = await printifyApi.get(
    `/shops/${process.env.PRINTIFY_SHOP_ID}/products.json`
  );

  return response.data;
}

// CREATE PRINTIFY ORDER
async function createPrintifyOrder(order) {
  if (!process.env.PRINTIFY_SHOP_ID) {
    throw new Error(
      "PRINTIFY_SHOP_ID is missing"
    );
  }

  if (!order) {
    throw new Error(
      "Order is required."
    );
  }

  if (
    !order.customer ||
    !order.items ||
    order.items.length === 0
  ) {
    throw new Error(
      "Order customer and items are required."
    );
  }

  const lineItems = order.items.map(
    (item) => {
      if (!item.productId) {
        throw new Error(
          `Missing Printify product ID for item: ${item.name}`
        );
      }

      if (!item.variantId) {
        throw new Error(
          `Missing Printify variant ID for item: ${item.name}`
        );
      }

      return {
        product_id: String(
          item.productId
        ),

        variant_id: Number(
          item.variantId
        ),

        quantity: Number(
          item.quantity
        ),

        external_id: `${order.orderNumber}-${item.productId}-${item.variantId}`,
      };
    }
  );

  const addressTo = {
    first_name:
      order.customer.firstName,

    last_name:
      order.customer.lastName,

    email:
      order.customer.email,

    phone:
      order.customer.phone,

    country: "IN",

    region:
      order.customer.state,

    address1:
      order.customer.address,

    city:
      order.customer.city,

    zip:
      order.customer.postalCode,
  };

  const payload = {
    external_id:
      order.orderNumber,

    label:
      order.orderNumber,

    line_items: lineItems,

    shipping_method: 1,

    send_shipping_notification: false,

    address_to: addressTo,
  };

  const response =
    await printifyApi.post(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
      payload
    );

  return response.data;
}

async function sendPrintifyOrderToProduction(
  printifyOrderId
) {
  if (!process.env.PRINTIFY_SHOP_ID) {
    throw new Error(
      "PRINTIFY_SHOP_ID is missing"
    );
  }

  if (!printifyOrderId) {
    throw new Error(
      "Printify order ID is required."
    );
  }

  const response =
    await printifyApi.post(
      `/shops/${process.env.PRINTIFY_SHOP_ID}/orders/${printifyOrderId}/send_to_production.json`
    );

  return response.data;
}

export {
  printifyApi,
  getShopDetails,
  getProducts,
  sendPrintifyOrderToProduction,
  createPrintifyOrder,
};