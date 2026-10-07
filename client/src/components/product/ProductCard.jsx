import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const colorClasses = {
  coral: "vega-product-card__visual--coral",
  yellow: "vega-product-card__visual--yellow",
  blue: "vega-product-card__visual--blue",
  green: "vega-product-card__visual--green",
};

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quickAdded, setQuickAdded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const productImage =
    product?.image ||
    product?.images?.[0] ||
    "";

  const productName =
    product?.name ||
    product?.title ||
    "Vega Strado product";

  const handleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsFavorite((current) => !current);
  };

  const handleQuickAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setQuickAdded(true);

    window.setTimeout(() => {
      setQuickAdded(false);
    }, 1200);
  };

  return (
    <motion.article
      className="vega-product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      whileHover={{ y: -8 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="vega-product-card__media">
        <Link
          to={`/product/${product.id}`}
          className="vega-product-card__link"
          aria-label={`View ${productName}`}
        >
          <div
            className={`vega-product-card__visual ${
              colorClasses[product.color] || ""
            }`}
          >
            {productImage && !imageFailed ? (
              <img
                src={productImage}
                alt={productName}
                className="vega-product-card__image"
                loading="lazy"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <>
                <motion.span
                  className="vega-product-card__brand"
                  whileHover={{ y: -2 }}
                >
                  VEGA STRADO
                </motion.span>

                <motion.div
                  className="vega-product-card__symbol"
                  whileHover={{
                    rotate: 0,
                    scale: 1.08,
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 16,
                  }}
                >
                  V
                </motion.div>
              </>
            )}

            {product.badge && (
              <span className="vega-product-card__badge">
                {product.badge}
              </span>
            )}

            <motion.span
              className="vega-product-card__view"
              initial={{
                opacity: 0,
                y: 10,
              }}
              whileHover={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              VIEW ↗
            </motion.span>
          </div>
        </Link>

        <motion.button
          type="button"
          className={`vega-product-card__favorite ${
            isFavorite ? "is-active" : ""
          }`}
          onClick={handleFavorite}
          whileTap={{ scale: 0.8 }}
          aria-label={
            isFavorite
              ? `Remove ${productName} from favorites`
              : `Add ${productName} to favorites`
          }
          aria-pressed={isFavorite}
        >
          <motion.span
            animate={{
              scale: isFavorite
                ? [1, 1.35, 1]
                : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            {isFavorite ? "♥" : "♡"}
          </motion.span>
        </motion.button>

        <motion.button
          type="button"
          className={`vega-product-card__quick-add ${
            quickAdded ? "is-added" : ""
          }`}
          onClick={handleQuickAdd}
          whileTap={{ scale: 0.96 }}
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {quickAdded ? (
              <motion.span
                key="added"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
              >
                ADDED ✓
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
              >
                QUICK ADD +
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <Link
        to={`/product/${product.id}`}
        className="vega-product-card__info"
      >
        <div>
          <h3>{productName}</h3>
          <p>{product.category}</p>
        </div>

        <span className="vega-product-card__price">
          ₹
          {Number(product.price || 0).toLocaleString(
            "en-IN"
          )}
        </span>
      </Link>
    </motion.article>
  );
}

export default ProductCard;