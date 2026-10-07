import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

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
    <div className="vega-cart-page">
      <section className="vega-cart-page__hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            YOUR BAG
          </motion.span>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h1>
              YOUR
              <br />
              <span>CART.</span>
            </h1>
          </motion.div>

          {cart.length > 0 && (
            <motion.p
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.2,
              }}
            >
              {cartCount}{" "}
              {cartCount === 1
                ? "item"
                : "items"}{" "}
              ready to go.
            </motion.p>
          )}
        </div>
      </section>

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <section className="vega-cart-page__content">
          <div className="vega-container">
            <div className="vega-cart-page__layout">
              {/* Cart Items */}
              <div className="vega-cart-page__items">
                <div className="vega-cart-page__items-header">
                  <span>PRODUCT</span>
                  <span>{cartCount} ITEMS</span>
                </div>

                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <CartPageItem
                      key={item.id}
                      item={item}
                      onQuantityChange={
                        handleQuantityChange
                      }
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>

                <Link
                  to="/shop"
                  className="vega-cart-page__continue"
                >
                  ← CONTINUE SHOPPING
                </Link>
              </div>

              {/* Summary */}
              <CartSummary
                subtotal={cartSubtotal}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function CartPageItem({
  item,
  onQuantityChange,
  onRemove,
}) {
  const productImage =
    item.image ||
    item.images?.[0] ||
    item.product?.image ||
    item.product?.images?.[0] ||
    "";

  return (
    <motion.article
      className="vega-cart-page-item"
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: -30,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="vega-cart-page-item__image">
        {productImage ? (
          <img
            src={productImage}
            alt={item.name}
            loading="lazy"
          />
        ) : (
          <span>V</span>
        )}
      </div>

      <div className="vega-cart-page-item__details">
        <div className="vega-cart-page-item__top">
          <div>
            <span className="vega-cart-page-item__category">
              {item.category}
            </span>

            <h2>{item.name}</h2>

            {item.variantTitle && (
              <p>{item.variantTitle}</p>
            )}

            <div className="vega-cart-page-item__options">
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
          </div>

          <button
            type="button"
            className="vega-cart-page-item__remove"
            onClick={() =>
              onRemove(item.id)
            }
            aria-label={`Remove ${item.name} from cart`}
          >
            REMOVE ×
          </button>
        </div>

        <div className="vega-cart-page-item__bottom">
          <div className="vega-cart-page-item__quantity">
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

          <strong>
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

function CartSummary({ subtotal }) {
  return (
    <motion.aside
      className="vega-cart-summary"
      initial={{
        opacity: 0,
        x: 25,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.45,
      }}
    >
      <span className="vega-section-eyebrow">
        ORDER SUMMARY
      </span>

      <h2>SUMMARY.</h2>

      <div className="vega-cart-summary__row">
        <span>Subtotal</span>

        <strong>
          ₹{subtotal.toLocaleString("en-IN")}
        </strong>
      </div>

      <div className="vega-cart-summary__row vega-cart-summary__row--muted">
        <span>Shipping</span>
        <span>Calculated at checkout</span>
      </div>

      <div className="vega-cart-summary__divider" />

      <div className="vega-cart-summary__total">
        <span>Total</span>

        <strong>
          ₹{subtotal.toLocaleString("en-IN")}
        </strong>
      </div>

      <Link
        to="/checkout"
        className="vega-cart-summary__checkout"
      >
        <span>PROCEED TO CHECKOUT</span>
        <span>↗</span>
      </Link>

      <p>
        Shipping and taxes will be calculated
        during checkout.
      </p>
    </motion.aside>
  );
}

function EmptyCart() {
  return (
    <section className="vega-cart-empty-page">
      <div className="vega-container">
        <motion.div
          className="vega-cart-empty-page__inner"
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.45,
          }}
        >
          <div className="vega-cart-empty-page__symbol">
            V
          </div>

          <span className="vega-section-eyebrow">
            NOTHING HERE YET
          </span>

          <h2>
            YOUR CART
            <br />
            IS EMPTY.
          </h2>

          <p>
            Find something that feels like you.
          </p>

          <Link
            to="/shop"
            className="vega-cart-empty-page__button"
          >
            EXPLORE SHOP ↗
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Cart;