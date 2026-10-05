import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import ProductCard from "../product/ProductCard";
import { featuredProducts } from "../product/featuredProducts";

function FeaturedProducts() {
  return (
    <section className="vega-featured-products">
      <div className="vega-featured-products__inner">
        <motion.div
          className="vega-featured-products__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <span className="vega-section-eyebrow">
              ✦ THE LATEST
            </span>

            <h2>
              Featured
              <br />
              <span>pieces.</span>
            </h2>
          </div>

          <div className="vega-featured-products__intro">
            <p>
              Everyday essentials with a little more personality.
              Designed to make your rotation feel anything but
              ordinary.
            </p>

            <Link to="/shop" className="vega-featured-products__link">
              View all
              <span>↗</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="vega-featured-products__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.1,
          }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: {
                  opacity: 0,
                  y: 35,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProducts;