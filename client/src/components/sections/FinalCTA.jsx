import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function FinalCTA() {
  return (
    <section className="vega-final-cta" aria-labelledby="final-cta-title">
      <div className="vega-final-cta__glow vega-final-cta__glow--one" />
      <div className="vega-final-cta__glow vega-final-cta__glow--two" />

      <div className="vega-final-cta__container">
        <motion.span
          className="vega-section-eyebrow"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          YOUR NEXT MOVE
        </motion.span>

        <motion.h2
          id="final-cta-title"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.7,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          WEAR YOUR
          <br />
          <span>POINT OF VIEW.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 0.16,
          }}
        >
          Find the pieces that feel like you.
          <br />
          No rules. No blending in.
        </motion.p>

        <motion.div
          className="vega-final-cta__actions"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.6,
            delay: 0.24,
          }}
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link to="/shop" className="vega-final-cta__button">
              SHOP THE DROP
              <span>↗</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Link
              to="/about"
              className="vega-final-cta__button vega-final-cta__button--outline"
            >
              OUR STORY
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="vega-final-cta__mark"
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span>VS</span>
          <small>VEGA STRADO</small>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;