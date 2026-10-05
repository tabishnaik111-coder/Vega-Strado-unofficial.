import { createContext, useContext, useState } from "react";

const CartAnimationContext = createContext(null);

function CartAnimationProvider({ children }) {
  const [animation, setAnimation] = useState(null);
  const [cartBounce, setCartBounce] = useState(false);

  const triggerCartAnimation = (image) => {
    setAnimation({
      id: Date.now(),
      image: image || null,
    });

    setCartBounce(true);

    window.setTimeout(() => {
      setAnimation(null);
    }, 700);

    window.setTimeout(() => {
      setCartBounce(false);
    }, 500);
  };

  const value = {
    animation,
    cartBounce,
    triggerCartAnimation,
  };

  return (
    <CartAnimationContext.Provider value={value}>
      {children}
    </CartAnimationContext.Provider>
  );
}

export function useCartAnimation() {
  const context = useContext(CartAnimationContext);

  if (!context) {
    throw new Error(
      "useCartAnimation must be used inside CartAnimationProvider"
    );
  }

  return context;
}

export default CartAnimationProvider;