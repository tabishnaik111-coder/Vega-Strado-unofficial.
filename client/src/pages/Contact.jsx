import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);
  };

  return (
    <div className="vega-contact-page">
      {/* HERO */}
      <section className="vega-contact-hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            CONTACT
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            LET'S
            <br />
            <span>TALK.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Questions about your order, products or Vega
            Strado? Send us a message.
          </motion.p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="vega-contact-content">
        <div className="vega-container vega-contact-content__grid">
          {/* INFO */}
          <motion.div
            className="vega-contact-info"
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="vega-section-eyebrow">
              GET IN TOUCH
            </span>

            <h2>
              HAVE A
              <br />
              <span>QUESTION?</span>
            </h2>

            <p>
              We're here to help with orders, products,
              shipping and anything else you need to know
              about Vega Strado.
            </p>

            <div className="vega-contact-info__cards">
              <div>
                <span>ORDERS</span>
                <strong>
                  Need help with an existing order?
                </strong>
                <Link to="/tracking">
                  TRACK YOUR ORDER ↗
                </Link>
              </div>

              <div>
                <span>FAQ</span>
                <strong>
                  Looking for a quick answer?
                </strong>
                <Link to="/faq">
                  VISIT FAQ ↗
                </Link>
              </div>

              <div>
                <span>SHIPPING</span>
                <strong>
                  Questions about delivery or returns?
                </strong>
                <Link to="/shipping">
                  SHIPPING & RETURNS ↗
                </Link>
              </div>
            </div>
          </motion.div>

          {/* FORM */}
          <motion.div
            className="vega-contact-form-wrapper"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="vega-contact-success">
                <span className="vega-section-eyebrow">
                  MESSAGE RECEIVED
                </span>

                <h2>
                  THANK
                  <br />
                  <span>YOU.</span>
                </h2>

                <p>
                  Your message has been received. We'll get
                  back to you as soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: "",
                      email: "",
                      subject: "",
                      message: "",
                    });
                  }}
                >
                  SEND ANOTHER MESSAGE ↗
                </button>
              </div>
            ) : (
              <form
                className="vega-contact-form"
                onSubmit={handleSubmit}
              >
                <div className="vega-contact-form__header">
                  <span className="vega-section-eyebrow">
                    SEND A MESSAGE
                  </span>

                  <h2>CONTACT US.</h2>
                </div>

                <div className="vega-contact-form__grid">
                  <label>
                    <span>NAME</span>

                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label>
                    <span>EMAIL</span>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="vega-contact-form__full">
                    <span>SUBJECT</span>

                    <input
                      type="text"
                      name="subject"
                      placeholder="What can we help with?"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </label>

                  <label className="vega-contact-form__full">
                    <span>MESSAGE</span>

                    <textarea
                      name="message"
                      placeholder="Tell us what's on your mind..."
                      rows="7"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="vega-contact-form__button"
                >
                  SEND MESSAGE
                  <span>↗</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Contact;