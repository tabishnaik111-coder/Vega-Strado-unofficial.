import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getProducts } from "../../services/api";
import ProductCard from "./ProductCard";

function RelatedProducts({ product }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatedProducts();
  }, [product?.id]);

  async function loadRelatedProducts() {
    try {
      setLoading(true);

      const result = await getProducts({
        category: product?.category || "",
      });

      const related = (result.products || [])
        .filter(
          (item) =>
            String(item.id) !== String(product?.id)
        )
        .slice(0, 4);

      setProducts(related);
    } catch (error) {
      console.error(
        "Related products error:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section
      className="vega-related-products"
      aria-labelledby="related-products-title"
    >
      <div className="vega-related-products__container">
        <motion.div
          className="vega-related-products__header"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <span className="vega-section-eyebrow">
              KEEP EXPLORING
            </span>

            <h2 id="related-products-title">
              YOU MAY ALSO <span>LIKE.</span>
            </h2>
          </div>

          <span className="vega-related-products__count">
            {loading
              ? "LOADING"
              : `${products.length} PIECES`}
          </span>
        </motion.div>

        {loading ? (
          <RelatedLoading />
        ) : (
          <motion.div
            className="vega-related-products__grid"
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
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {products.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 25,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.45,
                      ease: [
                        0.22,
                        1,
                        0.36,
                        1,
                      ],
                    },
                  },
                }}
              >
                <ProductCard
                  product={{
                    ...item,
                    name: item.title,
                    price: item.price,
                    category: item.category,
                    color: getCardColor(item),
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

function RelatedLoading() {
  return (
    <div className="vega-related-products__grid">
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <div
            className="vega-related-products__skeleton"
            key={index}
          >
            <div />
            <span />
            <span />
          </div>
        )
      )}
    </div>
  );
}

function getCardColor(product) {
  const colors = product.colors || [];

  const color =
    colors[0]?.toLowerCase() || "";

  if (color.includes("red")) {
    return "coral";
  }

  if (color.includes("yellow")) {
    return "yellow";
  }

  if (
    color.includes("blue") ||
    color.includes("navy")
  ) {
    return "blue";
  }

  if (
    color.includes("green") ||
    color.includes("olive")
  ) {
    return "green";
  }

  return "cream";
}

export default RelatedProducts;