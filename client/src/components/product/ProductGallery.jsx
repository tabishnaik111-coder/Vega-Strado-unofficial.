import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function ProductGallery({ product }) {
  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [
          {
            id: "default-image",
            src: product.image,
            isDefault: true,
          },
        ]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

  function showImage(index) {
    if (!images.length) return;

    const nextIndex =
      (index + images.length) % images.length;

    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  }

  function showNext() {
    if (!images.length) return;

    setDirection(1);
    setActiveIndex(
      (current) => (current + 1) % images.length
    );
  }

  function showPrevious() {
    if (!images.length) return;

    setDirection(-1);
    setActiveIndex(
      (current) =>
        (current - 1 + images.length) % images.length
    );
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }
  }

  if (!images.length) {
    return (
      <div className="vega-product-gallery">
        <div className="vega-product-gallery__empty">
          <span>VS</span>
          <small>VEGA STRADO</small>
        </div>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div
      className="vega-product-gallery"
      onKeyDown={handleKeyDown}
    >
      <div className="vega-product-gallery__main">
        <AnimatePresence
          mode="wait"
          initial={false}
          custom={direction}
        >
          <motion.div
            key={activeImage.id || activeImage.src}
            className="vega-product-gallery__image-stage"
            custom={direction}
            initial={{
              opacity: 0,
              x: direction * 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction * -25,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <img
              src={activeImage.src}
              alt={`${product.title} - image ${
                activeIndex + 1
              }`}
              className="vega-product-gallery__image"
            />
          </motion.div>
        </AnimatePresence>

        {images.length > 1 && (
          <>
            <button
              type="button"
              className="vega-product-gallery__arrow vega-product-gallery__arrow--previous"
              onClick={showPrevious}
              aria-label="Previous product image"
            >
              ←
            </button>

            <button
              type="button"
              className="vega-product-gallery__arrow vega-product-gallery__arrow--next"
              onClick={showNext}
              aria-label="Next product image"
            >
              →
            </button>
          </>
        )}

        <div className="vega-product-gallery__counter">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div
          className="vega-product-gallery__thumbnails"
          role="tablist"
          aria-label="Product images"
        >
          {images.map((image, index) => (
            <button
              key={image.id || image.src || index}
              type="button"
              className={`vega-product-gallery__thumbnail ${
                activeIndex === index ? "is-active" : ""
              }`}
              onClick={() => showImage(index)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-label={`View product image ${
                index + 1
              }`}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;