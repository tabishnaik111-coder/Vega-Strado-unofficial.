import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function ShippingReturns() {
  return (
    <div className="vega-shipping-page">
      {/* HERO */}
      <section className="vega-shipping-hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            SHIPPING & RETURNS
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            SHIPPING.
            <br />
            <span>RETURNS.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Everything you need to know about getting your
            Vega Strado order and what happens if something
            isn't right.
          </motion.p>
        </div>
      </section>

      {/* SHIPPING */}
      <section className="vega-shipping-content">
        <div className="vega-container">
          <PolicySection
            number="01"
            title="SHIPPING"
            items={[
              {
                title: "WHERE WE SHIP",
                text:
                  "We ship to locations supported by our fulfillment and delivery partners. Available shipping destinations are shown during checkout.",
              },
              {
                title: "PROCESSING",
                text:
                  "Orders are prepared for fulfillment after payment is successfully completed. Processing time can vary depending on the product.",
              },
              {
                title: "DELIVERY TIME",
                text:
                  "Delivery times depend on the destination, product and fulfillment process. The estimated delivery information available during checkout is the best indication for your order.",
              },
              {
                title: "TRACKING",
                text:
                  "Once tracking information becomes available, it will be connected to your order and can be viewed through the Order Tracking page.",
              },
            ]}
          />

          <PolicySection
            number="02"
            title="RETURNS"
            items={[
              {
                title: "ELIGIBILITY",
                text:
                  "Return eligibility depends on the condition of the product and the applicable return policy for the item.",
              },
              {
                title: "DAMAGED PRODUCTS",
                text:
                  "If your order arrives damaged or has a manufacturing issue, contact Vega Strado as soon as possible with your order details and supporting photos.",
              },
              {
                title: "WRONG ITEM",
                text:
                  "If you receive an incorrect product or variant, contact us so we can review the order and help resolve the issue.",
              },
              {
                title: "CUSTOMER RESPONSIBILITY",
                text:
                  "Please make sure your delivery address, contact details and selected product variants are correct before completing your order.",
              },
            ]}
          />

          <PolicySection
            number="03"
            title="IMPORTANT"
            items={[
              {
                title: "ORDER CHANGES",
                text:
                  "Contact us as soon as possible if you need to change an order. Once an order enters fulfillment, changes or cancellation may no longer be possible.",
              },
              {
                title: "REFUNDS",
                text:
                  "Approved refunds are handled according to the applicable payment and return process.",
              },
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="vega-shipping-cta">
        <div className="vega-container">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="vega-section-eyebrow">
              NEED HELP?
            </span>

            <h2>
              WE'RE HERE
              <br />
              <span>FOR YOU.</span>
            </h2>

            <Link
              to="/contact"
              className="vega-shipping-cta__button"
            >
              CONTACT US ↗
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function PolicySection({ number, title, items }) {
  return (
    <motion.section
      className="vega-policy-section"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5 }}
    >
      <div className="vega-policy-section__heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>

      <div className="vega-policy-section__items">
        {items.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

export default ShippingReturns;