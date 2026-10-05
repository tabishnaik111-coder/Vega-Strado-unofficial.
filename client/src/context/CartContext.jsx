import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "vega-cart";

function loadCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCart) {
      return [];
    }

    const parsedCart = JSON.parse(storedCart);

    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (error) {
    console.error("Unable to load cart:", error);
    return [];
  }
}

function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
      );
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [cart]);

  const addToCart = (product, variant = null, quantity = 1) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    const variantId = variant?.id || "default";

    setCart((currentCart) => {
      const existingIndex = currentCart.findIndex(
        (item) =>
          String(item.productId) === String(product.id) &&
          String(item.variantId) === String(variantId)
      );

      if (existingIndex !== -1) {
        return currentCart.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + safeQuantity,
              }
            : item
        );
      }

      const cartItem = {
        id: `${product.id}-${variantId}`,

        productId: product.id,
        variantId,

        name: product.title || product.name,
        price: Number(
          variant?.price ?? product.price ?? 0
        ),

        image:
          product.image ||
          product.images?.[0]?.src ||
          null,

        category: product.category || "",

        size: variant?.size || "",
        color: variant?.color || "",

        variantTitle: variant?.title || "",

        quantity: safeQuantity,
      };

      return [...currentCart, cartItem];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    const safeQuantity = Math.max(1, Number(quantity) || 1);

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== itemId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [cart]
  );

  const value = {
    cart,
    cartCount,
    cartSubtotal,

    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}

export default CartProvider;