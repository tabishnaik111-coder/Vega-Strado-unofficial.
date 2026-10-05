import { motion } from "framer-motion";
import { collections } from "./collectionsData";

function Collections() {
  return (
    <section
      className="vega-collections"
      aria-labelledby="collections-title"
    >
      <div className="vega-collections__intro">
        <motion.span
          className="vega-section-eyebrow"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          EXPLORE THE WORLD
        </motion.span>

        <motion.h2
          id="collections-title"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          FIND YOUR
          <br />
          <span>STRADO.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.16,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Different moods. Different moments.
          <br />
          One unmistakable identity.
        </motion.p>
      </div>

      <div className="vega-collections__viewport">
        <div className="vega-collections__track">
          {collections.map((collection, index) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection, index }) {
  return (
    <motion.article
      className={`vega-collection-card vega-collection-card--${collection.color}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
      }}
    >
      <div className="vega-collection-card__top">
        <span className="vega-collection-card__eyebrow">
          {collection.eyebrow}
        </span>

        <span className="vega-collection-card__tag">
          {collection.tag}
        </span>
      </div>

      <div className="vega-collection-card__center">
        <motion.div
          className={`vega-collection-card__symbol vega-collection-card__symbol--${collection.accent}`}
          whileHover={{
            rotate: index % 2 === 0 ? 8 : -8,
            scale: 1.06,
          }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 15,
          }}
        >
          {collection.symbol}
        </motion.div>
      </div>

      <div className="vega-collection-card__bottom">
        <div>
          <h3>{collection.title}</h3>

          <p>{collection.description}</p>
        </div>

        <motion.button
          type="button"
          className="vega-collection-card__arrow"
          whileHover={{
            scale: 1.08,
            rotate: 5,
          }}
          whileTap={{
            scale: 0.92,
          }}
          aria-label={`Explore ${collection.title} collection`}
        >
          ↗
        </motion.button>
      </div>

      <span className="vega-collection-card__number">
        0{index + 1}
      </span>
    </motion.article>
  );
}

export default Collections;