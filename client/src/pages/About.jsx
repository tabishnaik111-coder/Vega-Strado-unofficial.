import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="vega-about-page">
      {/* HERO */}
      <section className="vega-about-hero">
        <div className="vega-container">
          <motion.span
            className="vega-section-eyebrow"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ABOUT VEGA STRADO
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            BUILT FOR
            <br />
            <span>THE DIFFERENT.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            Vega Strado is a modern streetwear brand built
            around individuality, confidence and the freedom
            to create your own identity.
          </motion.p>
        </div>
      </section>

      {/* STORY */}
      <section className="vega-about-story">
        <div className="vega-container vega-about-story__grid">
          <motion.div
            className="vega-about-story__visual"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <div className="vega-about-story__mark">VS</div>
          </motion.div>

          <motion.div
            className="vega-about-story__content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="vega-section-eyebrow">
              THE STORY
            </span>

            <h2>
              WEAR
              <br />
              YOUR <span>STORY.</span>
            </h2>

            <p>
              Vega Strado was created for people who don't
              want to simply follow what everyone else is
              wearing.
            </p>

            <p>
              Our approach combines expressive streetwear
              with a premium visual identity. Every piece is
              designed to feel like part of your personality,
              not just another item in your wardrobe.
            </p>

            <p>
              From everyday essentials to statement pieces,
              Vega Strado is about creating your own path.
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="vega-about-values">
        <div className="vega-container">
          <div className="vega-about-values__header">
            <span className="vega-section-eyebrow">
              WHAT WE BELIEVE
            </span>

            <h2>
              SMALL THINGS.
              <br />
              <span>BIG PERSONALITY.</span>
            </h2>
          </div>

          <div className="vega-about-values__grid">
            <ValueCard
              number="01"
              title="BE DIFFERENT"
              text="Your style doesn't need permission. Build an identity that feels like you."
            />

            <ValueCard
              number="02"
              title="STAY BOLD"
              text="Make choices with confidence. Stand out instead of blending in."
            />

            <ValueCard
              number="03"
              title="KEEP MOVING"
              text="Style evolves. So do you. Keep experimenting and keep creating."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="vega-about-cta">
        <div className="vega-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="vega-section-eyebrow">
              FIND YOUR STYLE
            </span>

            <h2>
              READY TO
              <br />
              <span>STAND OUT?</span>
            </h2>

            <Link
              to="/shop"
              className="vega-about-cta__button"
            >
              SHOP VEGA STRADO ↗
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ number, title, text }) {
  return (
    <motion.article
      className="vega-about-value-card"
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
    >
      <span>{number}</span>

      <h3>{title}</h3>

      <p>{text}</p>
    </motion.article>
  );
}

export default About;