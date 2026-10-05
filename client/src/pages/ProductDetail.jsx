import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getProductById } from "../services/api";
import ProductGallery from "../components/product/ProductGallery";
import VariantSelector from "../components/product/VariantSelector";
import Reviews from "../components/product/Reviews";
import RelatedProducts from "../components/product/RelatedProducts";
import { useCart } from "../context/CartContext";
import { useCartAnimation } from "../context/CartAnimationContext";

function ProductDetail() {
  const { triggerCartAnimation } = useCartAnimation();
  const { addToCart } = useCart();
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");
      setProduct(null);

      const data = await getProductById(slug);

      setProduct(data);
    } catch (error) {
      console.error("Product detail error:", error);

      setError(
        error.message || "Unable to load this product."
      );
    } finally {
      setLoading(false);
    }
  }

  const handleVariantChange = ({
  variant,
  size,
  color,
}) => {
  setSelectedVariant(variant);
  setSelectedSize(size);
  setSelectedColor(color);
};

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

const handleAddToCart = () => {
  if (!product) {
    return;
  }

  const cartVariant = selectedVariant
    ? {
        ...selectedVariant,
        size: selectedSize,
        color: selectedColor,
      }
    : null;

  addToCart(
    product,
    cartVariant,
    quantity
  );

  triggerCartAnimation(
    product.image ||
      product.images?.[0]?.src ||
      null
  );
};

  if (loading) {
    return <ProductLoading />;
  }

  if (error || !product) {
    return (
      <ProductError
        message={error || "Product not found."}
        onRetry={loadProduct}
      />
    );
  }

  return (
    <div className="vega-product-detail">
      <section className="vega-product-detail__section">
        <div className="vega-product-detail__container">
          <Link
            to="/shop"
            className="vega-product-detail__back"
          >
            ← BACK TO SHOP
          </Link>

          <div className="vega-product-detail__layout">
            {/* Product Visual */}
            <motion.div
  className="vega-product-detail__media"
  initial={{
    opacity: 0,
    x: -30,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
  }}
>
  <ProductGallery product={product} />
</motion.div>

            {/* Product Information */}
            <motion.div
              className="vega-product-detail__info"
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="vega-product-detail__category">
                {product.category || "VEGA STRADO"}
              </span>

              <h1>{product.title}</h1>

              <div className="vega-product-detail__price">
  ₹
  {Number(
    selectedVariant?.price || product.price || 0
  ).toLocaleString("en-IN")}
</div>

              {product.description && (
                <div
                  className="vega-product-detail__description"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              )}

             <VariantSelector
  variants={product.variants || []}
  sizes={product.sizes || []}
  colors={product.colors || []}
  onVariantChange={handleVariantChange}
/>
              {/* Quantity */}
              <div className="vega-product-detail__quantity">
                <span>QUANTITY</span>

                <div className="vega-product-detail__quantity-control">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <motion.button
                type="button"
                className="vega-product-detail__add"
                onClick={handleAddToCart}
                whileHover={{
                  y: -3,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                ADD TO CART
                <span>→</span>
              </motion.button>

              <p className="vega-product-detail__note">
                Product fulfillment is handled through
                Vega Strado's print-on-demand system.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

            <Reviews productId={product.id} />

      <RelatedProducts product={product} />

    </div>
  );
}

function ProductLoading() {
  return (
    <div className="vega-product-detail__state">
      <div className="vega-product-detail__loading-image" />

      <div className="vega-product-detail__loading-content">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

function ProductError({ message, onRetry }) {
  return (
    <div className="vega-product-detail__state vega-product-detail__state--error">
      <span className="vega-product-detail__state-icon">
        !
      </span>

      <h1>PRODUCT NOT FOUND</h1>

      <p>{message}</p>

      <div className="vega-product-detail__state-actions">
        <button type="button" onClick={onRetry}>
          TRY AGAIN
        </button>

        <Link to="/shop">
          BACK TO SHOP
        </Link>
      </div>
    </div>
  );
}

export default ProductDetail;