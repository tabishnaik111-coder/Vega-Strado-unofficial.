const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let result;

  try {
    result = await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Something went wrong"
    );
  }

  return result;
}

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();

  const endpoint = queryString
    ? `/products?${queryString}`
    : "/products";

  const result = await request(endpoint);

  return {
    products: result.data || [],
    count: result.count || 0,
  };
}

export async function getProductById(productId) {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  const result = await request(
    `/products/${encodeURIComponent(productId)}`
  );

  return result.data;
}

export async function getFilterOptions() {
  const result = await request(
    "/products/filters/options"
  );

  return result.data;
}