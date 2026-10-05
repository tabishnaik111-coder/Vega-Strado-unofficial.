import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";

function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = (
    item,
    newQuantity
  ) => {
    if (newQuantity < 1) {
      removeFromCart(item.id);
      return;
    }

    updateQuantity(item.id, newQuantity);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="vega-cart-drawer__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            className="vega-cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
          >
            {/* Header */}
            <div className="vega-cart-drawer__header">
              <div>
                <span className="vega-section-eyebrow">
                  YOUR BAG
                </span>

                <h2 id="cart-drawer-title">
                  CART
                  <span>{cartCount}</span>
                </h2>
              </div>

              <button
                type="button"
                className="vega-cart-drawer__close"
                onClick={onClose}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {/* Cart Content */}
            <div className="vega-cart-drawer__content" data-lenis-prevent>
              {cart.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <div className="vega-cart-drawer__items">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={
                        handleQuantityChange
                      }
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="vega-cart-drawer__footer">
                <div className="vega-cart-drawer__subtotal">
                  <span>SUBTOTAL</span>

                  <strong>
                    ₹
                    {cartSubtotal.toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <p className="vega-cart-drawer__note">
                  Shipping and taxes are calculated at
                  checkout.
                </p>

                <Link
  to="/cart"
  className="vega-cart-drawer__view-cart"
  onClick={onClose}
>
  VIEW FULL CART
</Link>

                <Link
                  to="/checkout"
                  className="vega-cart-drawer__checkout"
                  onClick={onClose}
                >
                  <span>CHECKOUT</span>
                  <span>↗</span>
                </Link>

                <button
                  type="button"
                  className="vega-cart-drawer__continue"
                  onClick={onClose}
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItem({
  item,
  onQuantityChange,
  onRemove,
}) {
  return (
    <motion.article
      className="vega-cart-item"
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{
        duration: 0.3,
      }}
    >
      <div className="vega-cart-item__image">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
          />
        ) : (
          <span>V</span>
        )}
      </div>

      <div className="vega-cart-item__details">
        <div className="vega-cart-item__top">
          <div>
            <h3>{item.name}</h3>

            {item.variantTitle && (
              <p>{item.variantTitle}</p>
            )}

            {(item.size || item.color) && (
              <div className="vega-cart-item__options">
                {item.size && (
                  <span>
                    Size: {item.size}
                  </span>
                )}

                {item.color && (
                  <span>
                    Color: {item.color}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="vega-cart-item__remove"
            onClick={() =>
              onRemove(item.id)
            }
            aria-label={`Remove ${item.name} from cart`}
          >
            ×
          </button>
        </div>

        <div className="vega-cart-item__bottom">
          <div className="vega-cart-item__quantity">
            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  item,
                  item.quantity - 1
                )
              }
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              type="button"
              onClick={() =>
                onQuantityChange(
                  item,
                  item.quantity + 1
                )
              }
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>

          <strong className="vega-cart-item__price">
            ₹
            {(
              item.price * item.quantity
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyCart({ onClose }) {
  return (
    <div className="vega-cart-empty">
      <div className="vega-cart-empty__symbol">
        V
      </div>

      <span className="vega-section-eyebrow">
        NOTHING HERE YET
      </span>

      <h3>
        YOUR CART
        <br />
        IS EMPTY.
      </h3>

      <p>
        Find something that feels like you.
      </p>

      <Link
        to="/shop"
        className="vega-cart-empty__button"
        onClick={onClose}
      >
        SHOP NOW ↗
      </Link>
    </div>
  );
}

export default CartDrawer;