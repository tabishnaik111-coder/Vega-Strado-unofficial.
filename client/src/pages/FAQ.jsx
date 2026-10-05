import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
  {
    question: "WHAT IS VEGA STRADO?",
    answer:
      "Vega Strado is a modern streetwear brand focused on expressive, premium-inspired clothing designed for people who want their style to reflect their personality.",
  },
  {
    question: "WHERE DO YOU SHIP?",
    answer:
      "We ship to available locations supported by our delivery partners. Shipping availability and delivery estimates are shown during the checkout process.",
  },
  {
    question: "HOW LONG DOES DELIVERY TAKE?",
    answer:
      "Delivery times can vary depending on the product, destination and fulfillment process. Your order tracking information will provide the latest available status.",
  },
  {
    question: "CAN I TRACK MY ORDER?",
    answer:
      "Yes. Once tracking information becomes available, you can use the Order Tracking page to check your shipment status and tracking details.",
  },
  {
    question: "CAN I CHANGE OR CANCEL MY ORDER?",
    answer:
      "Orders may only be changed or cancelled before they enter the fulfillment process. Contact us as soon as possible if you need assistance.",
  },
  {
    question: "HOW DO I CHOOSE THE RIGHT SIZE?",
    answer:
      "Check the size information available on the individual product page before adding an item to your cart.",
  },
  {
    question: "ARE THE PRODUCTS PRINT-ON-DEMAND?",
    answer:
      "Vega Strado currently uses a print-on-demand fulfillment model for its online products. This allows products to be produced after an order is placed.",
  },
  {
    question: "HOW CAN I CONTACT VEGA STRADO?",
    answer:
      "You can contact us through the Contact page. Our team will help with questions about orders, products and other issues.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <div className="vega-faq-page">
      {/* HERO */}
      <section className="vega-faq-hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            FAQ
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            GOT
            <br />
            <span>QUESTIONS?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Find answers to the most common questions about
            Vega Strado, orders and delivery.
          </motion.p>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="vega-faq-content">
        <div className="vega-container">
          <div className="vega-faq-list">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <motion.div
                  className={`vega-faq-item ${
                    isOpen ? "is-open" : ""
                  }`}
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.03,
                  }}
                >
                  <button
                    type="button"
                    className="vega-faq-item__question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                  >
                    <span>
                      <small>
                        {String(index + 1).padStart(2, "0")}
                      </small>

                      {faq.question}
                    </span>

                    <span
                      className="vega-faq-item__icon"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="vega-faq-item__answer"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;