import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  createPrintifyOrder,
  sendOrderToPrintifyProduction,
} from "../services/api";

function Checkout() {
  const { cart, cartSubtotal } = useCart();

  const [paymentMethod, setPaymentMethod] =
    useState("razorpay");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openRazorpayCheckout = async (
    orderNumber
  ) => {
    try {
      const paymentData =
        await createRazorpayOrder(orderNumber);

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout failed to load."
        );
      }

      const options = {
        key: paymentData.keyId,

        amount:
          paymentData.razorpayOrder.amount,

        currency:
          paymentData.razorpayOrder.currency,

        name: "Vega Strado",

        description:
          "Vega Strado clothing order",

        order_id:
          paymentData.razorpayOrder.id,

        prefill: {
          name: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          contact: customer.phone,
        },

        theme: {
          color: "#FF6B4A",
        },

        handler: async function (response) {
          try {
            setIsSubmitting(true);
            setError("");

            const result =
  await verifyRazorpayPayment({
    orderNumber,

    razorpay_order_id:
      response.razorpay_order_id,

    razorpay_payment_id:
      response.razorpay_payment_id,

    razorpay_signature:
      response.razorpay_signature,
  });

console.log(
  "Online order completed:",
  result.order
);

const printifyResult =
  await createPrintifyOrder(
    result.order.orderNumber
  );

console.log(
  "Printify order created:",
  printifyResult
);

const productionResult =
  await sendOrderToPrintifyProduction(
    result.order.orderNumber
  );

console.log(
  "Printify production started:",
  productionResult
);

alert(
  `Payment successful!\nOrder: ${result.order.orderNumber}`
);
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error
            );

            setError(
              error.message ||
                "Payment verification failed."
            );
          } finally {
            setIsSubmitting(false);
          }
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay checkout closed."
            );

            setIsSubmitting(false);
          },
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to start payment."
      );

      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const result = await createOrder({
        customer,

        items: cart,

        subtotal: cartSubtotal,

        total: cartSubtotal,

        paymentMethod,
      });

      console.log(
        "Order initialized:",
        result.order
      );

      if (
  paymentMethod === "cod" &&
  result.order.paymentStatus !==
    "cod_pending"
) {
  throw new Error(
    "COD order was not initialized correctly."
  );
}

      // RAZORPAY
      if (paymentMethod === "razorpay") {
        await openRazorpayCheckout(
          result.order.orderNumber
        );

        return;
      }

      // CASH ON DELIVERY
      if (paymentMethod === "cod") {
  console.log(
    "COD order created:",
    result.order
  );

  const printifyResult =
    await createPrintifyOrder(
      result.order.orderNumber
    );

  console.log(
    "Printify order created:",
    printifyResult
  );

  const productionResult =
  await sendOrderToPrintifyProduction(
    result.order.orderNumber
  );

console.log(
  "Printify production started:",
  productionResult
);

  alert(
    `Order placed successfully!\nOrder: ${result.order.orderNumber}`
  );

  return;
}

    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="vega-checkout-page">
      <section className="vega-checkout-page__hero">
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
            CHECKOUT
          </motion.span>

          <motion.h1
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
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            COMPLETE
            <br />
            <span>YOUR ORDER.</span>
          </motion.h1>
        </div>
      </section>

      <section className="vega-checkout-page__content">
        <div className="vega-container">
          <motion.form
            className="vega-checkout-page__layout"
            onSubmit={handleSubmit}
          >
            <CheckoutForm
              customer={customer}
              handleChange={handleChange}
              paymentMethod={paymentMethod}
              setPaymentMethod={
                setPaymentMethod
              }
            />

            <CheckoutSummary
              cart={cart}
              subtotal={cartSubtotal}
              isSubmitting={isSubmitting}
              error={error}
              paymentMethod={paymentMethod}
            />
          </motion.form>
        </div>
      </section>
    </div>
  );
}

function CheckoutForm({
  customer,
  handleChange,
  paymentMethod,
  setPaymentMethod,
}) {
  return (
    <motion.div
      className="vega-checkout-form"
      initial={{
        opacity: 0,
        y: 25,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
    >
      <div className="vega-checkout-form__header">
        <span className="vega-section-eyebrow">
          01 / DELIVERY
        </span>

        <h2>DELIVERY DETAILS.</h2>
      </div>

      <div className="vega-checkout-form__grid">
        <label>
          <span>FIRST NAME</span>

          <input
            type="text"
            name="firstName"
            placeholder="Your first name"
            autoComplete="given-name"
            value={customer.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>LAST NAME</span>

          <input
            type="text"
            name="lastName"
            placeholder="Your last name"
            autoComplete="family-name"
            value={customer.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="vega-checkout-form__full">
          <span>EMAIL ADDRESS</span>

          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={customer.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="vega-checkout-form__full">
          <span>PHONE NUMBER</span>

          <input
            type="tel"
            name="phone"
            placeholder="+91 XXXXX XXXXX"
            autoComplete="tel"
            value={customer.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label className="vega-checkout-form__full">
          <span>ADDRESS</span>

          <input
            type="text"
            name="address"
            placeholder="House number, street, area"
            autoComplete="street-address"
            value={customer.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>CITY</span>

          <input
            type="text"
            name="city"
            placeholder="City"
            autoComplete="address-level2"
            value={customer.city}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>STATE</span>

          <input
            type="text"
            name="state"
            placeholder="State"
            autoComplete="address-level1"
            value={customer.state}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          <span>PIN CODE</span>

          <input
            type="text"
            name="postalCode"
            placeholder="000000"
            inputMode="numeric"
            autoComplete="postal-code"
            value={customer.postalCode}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <div className="vega-checkout-form__payment">
        <span className="vega-section-eyebrow">
          02 / PAYMENT
        </span>

        <h2>PAYMENT METHOD.</h2>

        <div className="vega-checkout-form__payment-options">
          <label className="vega-checkout-form__payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="razorpay"
              checked={
                paymentMethod ===
                "razorpay"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
            />

            <div>
              <strong>
                SECURE ONLINE PAYMENT
              </strong>

              <p>
                Pay securely using
                Razorpay.
              </p>
            </div>

            <span className="vega-checkout-form__payment-badge">
              ONLINE
            </span>
          </label>

          <label className="vega-checkout-form__payment-option">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={
                paymentMethod === "cod"
              }
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value
                )
              }
            />

            <div>
              <strong>
                CASH ON DELIVERY
              </strong>

              <p>
                Pay when your order
                is delivered.
              </p>
            </div>

            <span className="vega-checkout-form__payment-badge">
              COD
            </span>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

function CheckoutSummary({
  cart,
  subtotal,
  isSubmitting,
  error,
  paymentMethod,
}) {
  return (
    <motion.aside
      className="vega-checkout-summary"
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
        delay: 0.1,
      }}
    >
      <div className="vega-checkout-summary__header">
        <span className="vega-section-eyebrow">
          YOUR ORDER
        </span>

        <h2>SUMMARY.</h2>
      </div>

      <div className="vega-checkout-summary__items">
        {cart.map((item) => (
          <div
            className="vega-checkout-summary__item"
            key={item.id}
          >
            <div className="vega-checkout-summary__image">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                />
              ) : (
                <span>V</span>
              )}

              <span>
                {item.quantity}
              </span>
            </div>

            <div className="vega-checkout-summary__details">
              <strong>
                {item.name}
              </strong>

              {(item.size ||
                item.color) && (
                <small>
                  {item.size &&
                    `Size: ${item.size}`}

                  {item.size &&
                    item.color &&
                    " · "}

                  {item.color &&
                    `Color: ${item.color}`}
                </small>
              )}
            </div>

            <strong>
              ₹
              {(
                item.price *
                item.quantity
              ).toLocaleString(
                "en-IN"
              )}
            </strong>
          </div>
        ))}
      </div>

      <div className="vega-checkout-summary__divider" />

      <div className="vega-checkout-summary__row">
        <span>Subtotal</span>

        <strong>
          ₹
          {subtotal.toLocaleString(
            "en-IN"
          )}
        </strong>
      </div>

      <div className="vega-checkout-summary__row">
        <span>Shipping</span>

        <span>Calculated next</span>
      </div>

      <div className="vega-checkout-summary__total">
        <span>Total</span>

        <strong>
          ₹
          {subtotal.toLocaleString(
            "en-IN"
          )}
        </strong>
      </div>

      {error && (
        <div className="vega-checkout-summary__error">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="vega-checkout-summary__button"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "PROCESSING..."
          : paymentMethod ===
            "cod"
          ? "PLACE COD ORDER"
          : "CONTINUE TO PAYMENT"}

        <span>
          {isSubmitting ? "…" : "↗"}
        </span>
      </button>

      <Link
        to="/cart"
        className="vega-checkout-summary__back"
      >
        ← BACK TO CART
      </Link>
    </motion.aside>
  );
}

export default Checkout;