import { motion } from "framer-motion";
import { reviewData } from "./reviewData";

function Reviews({ productId }) {
  const reviews =
    reviewData[productId] || reviewData.default;

  const averageRating =
    reviews.reduce(
      (total, review) => total + review.rating,
      0
    ) / reviews.length;

  return (
    <section
      className="vega-reviews"
      aria-labelledby="reviews-title"
    >
      <div className="vega-reviews__container">
        <motion.div
          className="vega-reviews__header"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
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
              WHAT PEOPLE SAY
            </span>

            <h2 id="reviews-title">
              REVIEWS<span>✦</span>
            </h2>
          </div>

          <div className="vega-reviews__summary">
            <strong>
              {averageRating.toFixed(1)}
            </strong>

            <div>
              <StarRating rating={averageRating} />

              <span>
                {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="vega-reviews__grid">
          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              className="vega-review-card"
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
                amount: 0.15,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="vega-review-card__top">
                <StarRating
                  rating={review.rating}
                />

                <span>{review.date}</span>
              </div>

              <h3>{review.title}</h3>

              <p>{review.comment}</p>

              <div className="vega-review-card__author">
                <span>
                  {review.name.charAt(0)}
                </span>

                <strong>{review.name}</strong>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="vega-reviews__notice">
          Reviews will be connected to real customer
          submissions in a future backend update.
        </div>
      </div>
    </section>
  );
}

function StarRating({ rating }) {
  return (
    <div
      className="vega-star-rating"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map(
        (_, index) => (
          <span
            key={index}
            className={
              index < Math.round(rating)
                ? "is-filled"
                : ""
            }
          >
            ★
          </span>
        )
      )}
    </div>
  );
}

export default Reviews;