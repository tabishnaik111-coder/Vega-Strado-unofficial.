import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedId = orderId.trim();

    if (!trimmedId) {
      setError("Please enter your order ID.");
      setOrder(null);
      return;
    }

    setError("");
    setOrder(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL ||
          "http://localhost:5000/api"
        }/orders/${encodeURIComponent(trimmedId)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Order could not be found."
        );
      }

      setOrder(data.order);
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Unable to find your order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="vega-tracking-page">
      <section className="vega-tracking-page__hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ORDER TRACKING
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            WHERE'S
            <br />
            <span>YOUR ORDER?</span>
          </motion.h1>
        </div>
      </section>

      <section className="vega-tracking-page__content">
        <div className="vega-container">
          <motion.div
            className="vega-tracking-search"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <span className="vega-section-eyebrow">
              TRACK YOUR ORDER
            </span>

            <h2>ENTER ORDER ID.</h2>

            <form
              className="vega-tracking-search__form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                value={orderId}
                onChange={(event) =>
                  setOrderId(event.target.value)
                }
                placeholder="VS-XXXXXXXXXXXXX"
                aria-label="Order ID"
              />

              <button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "SEARCHING..."
                  : "TRACK ORDER ↗"}
              </button>
            </form>

            {error && (
              <p className="vega-tracking-search__error">
                {error}
              </p>
            )}
          </motion.div>

          {order && <OrderResult order={order} />}
        </div>
      </section>
    </div>
  );
}

function OrderResult({ order }) {
  const status = getOrderStatus(order);

  return (
    <motion.section
      className="vega-order-result"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="vega-order-result__header">
        <div>
          <span className="vega-section-eyebrow">
            ORDER FOUND
          </span>

          <h2>{order.id}</h2>
        </div>

        <span className="vega-order-result__status">
          {formatStatus(status)}
        </span>
      </div>

      <div className="vega-order-progress">
  <TrackingStep
    number="01"
    title="ORDER PLACED"
    active
    completed={true}
  />

  <TrackingStep
    number="02"
    title="PROCESSING"
    active={[
      "processing",
      "in-production",
      "shipped",
      "delivered",
    ].includes(status)}
    completed={[
      "in-production",
      "shipped",
      "delivered",
    ].includes(status)}
  />

  <TrackingStep
    number="03"
    title="SHIPPED"
    active={[
      "shipped",
      "delivered",
    ].includes(status)}
    completed={[
      "shipped",
      "delivered",
    ].includes(status)}
  />

  <TrackingStep
    number="04"
    title="DELIVERED"
    active={status === "delivered"}
    completed={status === "delivered"}
  />
</div>

      <div className="vega-order-result__details">
        <div>
          <span>ORDER DATE</span>

          <strong>
            {order.createdAt
              ? new Date(
                  order.createdAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </strong>
        </div>

        <div>
          <span>ITEMS</span>

          <strong>
            {order.items?.reduce(
              (total, item) =>
                total + (Number(item.quantity) || 0),
              0
            ) || 0}
          </strong>
        </div>

        <div>
          <span>TOTAL</span>

          <strong>
            ₹
            {Number(order.subtotal || 0).toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>
      </div>

      {order.customer && (
        <div className="vega-order-result__delivery">
          <span className="vega-section-eyebrow">
            DELIVERY TO
          </span>

          <p>
            {order.customer.firstName}{" "}
            {order.customer.lastName}
            <br />
            {order.customer.address}
            <br />
            {order.customer.city},{" "}
            {order.customer.state}{" "}
            {order.customer.postalCode}
          </p>
        </div>
      )}

      {order.tracking && (
  <div className="vega-order-result__tracking">
    <span className="vega-section-eyebrow">
      SHIPMENT TRACKING
    </span>

    <div className="vega-order-result__tracking-info">
      <div>
        <span>CARRIER</span>

        <strong>
          {order.tracking.carrier ||
            "—"}
        </strong>
      </div>

      <div>
        <span>TRACKING NUMBER</span>

        <strong>
          {order.tracking.trackingNumber ||
            "—"}
        </strong>
      </div>

      {order.tracking.trackingUrl && (
        <a
          href={order.tracking.trackingUrl}
          target="_blank"
          rel="noreferrer"
        >
          TRACK SHIPMENT ↗
        </a>
      )}
    </div>
  </div>
)}

      {order.items?.length > 0 && (
        <div className="vega-order-result__items">
          <span className="vega-section-eyebrow">
            ORDER ITEMS
          </span>

          {order.items.map((item) => (
            <div
              className="vega-order-result__item"
              key={item.id}
            >
              <div className="vega-order-result__item-image">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                  />
                ) : (
                  <span>V</span>
                )}
              </div>

              <div>
                <strong>{item.name}</strong>

                <small>
                  Qty: {item.quantity}
                  {item.size &&
                    ` · Size: ${item.size}`}
                  {item.color &&
                    ` · ${item.color}`}
                </small>
              </div>

              <strong>
                ₹
                {(
                  Number(item.price || 0) *
                  Number(item.quantity || 0)
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function TrackingStep({
  number,
  title,
  active,
  completed,
}) {
  return (
    <div
      className={`vega-tracking-step ${
        active ? "is-active" : ""
      } ${completed ? "is-completed" : ""}`}
    >
      <div className="vega-tracking-step__number">
        {completed ? "✓" : number}
      </div>

      <span>{title}</span>
    </div>
  );
}

function getOrderStatus(order) {
  if (order.status) {
    return order.status;
  }

  if (order.paymentStatus === "pending") {
    return "payment_pending";
  }

  return "processing";
}

function formatStatus(status) {
  const statusMap = {
    payment_pending: "PAYMENT PENDING",
    processing: "PROCESSING",
    "in-production": "IN PRODUCTION",
    shipped: "SHIPPED",
    delivered: "DELIVERED",
    cancelled: "CANCELLED",
  };

  return (
    statusMap[status] ||
    String(status || "PROCESSING").toUpperCase()
  );
}

export default OrderTracking;