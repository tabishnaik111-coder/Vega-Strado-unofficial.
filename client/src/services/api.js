const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  async function handleResponse(
  response,
  fallbackMessage
) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        fallbackMessage
    );
  }

  return data;
}

export async function createOrder(orderData) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create order."
    );
  }

  return data;
}

export async function createRazorpayOrder(orderNumber) {
  const response = await fetch(
    `${API_URL}/payments/create-order`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        orderNumber,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to create payment order."
    );
  }

  return data;
}

export async function verifyRazorpayPayment(
  paymentData
) {
  const response = await fetch(
    `${API_URL}/payments/verify`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      credentials: "include",

      body: JSON.stringify(paymentData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to verify payment."
    );
  }

  return data;
}

export async function createPrintifyOrder(
  orderNumber
) {
  const response = await fetch(
    `${API_URL}/orders/${orderNumber}/printify`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      credentials: "include",
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to create Printify order."
    );
  }

  return data;
}

export async function sendOrderToPrintifyProduction(
  orderNumber
) {
  const response = await fetch(
    `${API_URL}/orders/${orderNumber}/printify/production`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      credentials: "include",
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Unable to send order to production."
    );
  }

  return data;
}

export {
  getProducts,
  getProductById,
  getFilterOptions,
} from "./productService";