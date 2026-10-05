import { getProducts } from "./printifyService.js";

function formatProduct(product) {
  const defaultImage =
    product.images?.find((image) => image.is_default)?.src ||
    product.images?.[0]?.src ||
    null;

  const images =
    product.images?.map((image) => ({
      id: image.id,
      src: image.src,
      position: image.position,
      isDefault: image.is_default,
    })) || [];

  const variants =
    product.variants?.map((variant) => ({
      id: variant.id,
      title: variant.title,
      price: variant.price,
      sku: variant.sku,
      available: variant.is_enabled,
      quantity: variant.quantity,
      options: variant.options,
    })) || [];

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    tags: product.tags || [],
    visible: product.visible,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    image: defaultImage,
    images,
    variants,
  };
}

function getProductCategory(product) {
  const tags = product.tags || [];

  const categoryTag = tags.find((tag) =>
    /t-shirt|shirt|hoodie|jacket|pants|jogger|cap|hat|accessory/i.test(
      tag
    )
  );

  if (categoryTag) {
    return categoryTag;
  }

  const title = product.title || "";

  if (/hoodie/i.test(title)) return "Hoodies";
  if (/t-shirt|tee/i.test(title)) return "T-Shirts";
  if (/jogger/i.test(title)) return "Joggers";
  if (/pant|cargo/i.test(title)) return "Pants";
  if (/cap|hat/i.test(title)) return "Accessories";

  return "Other";
}

function getProductPrice(product) {
  const prices =
    product.variants
      ?.filter((variant) => variant.is_enabled)
      ?.map((variant) => Number(variant.price))
      ?.filter((price) => Number.isFinite(price)) || [];

  if (!prices.length) {
    return 0;
  }

  return Math.min(...prices);
}

function getProductSizes(product) {
  const sizes = new Set();

  product.variants?.forEach((variant) => {
    variant.options?.forEach((option) => {
      if (
        option.name?.toLowerCase() === "size" ||
        option.option_name?.toLowerCase() === "size"
      ) {
        const value = option.value;

        if (value) {
          sizes.add(String(value));
        }
      }
    });
  });

  return [...sizes];
}

function getProductColors(product) {
  const colors = new Set();

  product.variants?.forEach((variant) => {
    variant.options?.forEach((option) => {
      const name =
        option.name?.toLowerCase() ||
        option.option_name?.toLowerCase() ||
        "";

      if (name === "color" || name === "colour") {
        if (option.value) {
          colors.add(String(option.value));
        }
      }
    });
  });

  return [...colors];
}

function enrichProduct(product) {
  const formattedProduct = formatProduct(product);

  return {
    ...formattedProduct,
    category: getProductCategory(product),
    price: getProductPrice(product),
    sizes: getProductSizes(product),
    colors: getProductColors(product),
  };
}

async function getFormattedProducts() {
  const response = await getProducts();

  const products = response.data || [];

  return products
    .filter((product) => product.visible !== false)
    .map(enrichProduct);
}

async function getFormattedProductById(productId) {
  const response = await getProducts();

  const products = response.data || [];

  const product = products.find(
    (item) => String(item.id) === String(productId)
  );

  if (!product) {
    return null;
  }

  return enrichProduct(product);
}

function filterProducts(products, filters) {
  const {
    category,
    search,
    size,
    color,
    minPrice,
    maxPrice,
    sort,
  } = filters;

  let filteredProducts = [...products];

  if (category) {
    const categoryValue = category.trim().toLowerCase();

    filteredProducts = filteredProducts.filter(
      (product) =>
        product.category.toLowerCase() === categoryValue
    );
  }

  if (search) {
    const searchValue = search.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const description =
        product.description?.toLowerCase() || "";
      const tags = product.tags
        ?.join(" ")
        .toLowerCase() || "";

      return (
        title.includes(searchValue) ||
        description.includes(searchValue) ||
        tags.includes(searchValue)
      );
    });
  }

  if (size) {
    const sizeValue = size.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) =>
      product.sizes.some(
        (productSize) =>
          productSize.toLowerCase() === sizeValue
      )
    );
  }

  if (color) {
    const colorValue = color.trim().toLowerCase();

    filteredProducts = filteredProducts.filter((product) =>
      product.colors.some(
        (productColor) =>
          productColor.toLowerCase() === colorValue
      )
    );
  }

  if (minPrice !== undefined) {
    const minimum = Number(minPrice);

    if (Number.isFinite(minimum)) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minimum
      );
    }
  }

  if (maxPrice !== undefined) {
    const maximum = Number(maxPrice);

    if (Number.isFinite(maximum)) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= maximum
      );
    }
  }

  switch (sort) {
    case "price-low":
      filteredProducts.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price-high":
      filteredProducts.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name":
      filteredProducts.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "newest":
      filteredProducts.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
      break;

    default:
      break;
  }

  return filteredProducts;
}

function getCategories(products) {
  return [
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ].sort();
}

function getAvailableSizes(products) {
  return [
    ...new Set(
      products.flatMap((product) => product.sizes)
    ),
  ].sort();
}

function getAvailableColors(products) {
  return [
    ...new Set(
      products.flatMap((product) => product.colors)
    ),
  ].sort();
}

export {
  formatProduct,
  getFormattedProducts,
  getFormattedProductById,
  filterProducts,
  getCategories,
  getAvailableSizes,
  getAvailableColors,
};