import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getProductReviews,
  submitProductReview,
} from "../../services/api";

function Reviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orderNumber: "",
    customerName: "",
    customerEmail: "",
    rating: 5,
    review: "",
  });

  async function loadReviews() {
    try {
      setLoading(true);
      setError("");

      const data = await getProductReviews(productId);

      setReviews(data.reviews || []);

      setSummary(
        data.summary || {
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        }
      );
    } catch (error) {
      console.error("Load reviews error:", error);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  function updateField(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      const data = await submitProductReview({
        productId,
        orderNumber: formData.orderNumber.trim(),
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        rating: Number(formData.rating),
        review: formData.review.trim(),
      });

      /*
        Backend returns the newly approved review.
        Add it immediately to the existing reviews.
      */
      if (data.review) {
        const newReview = data.review;

        setReviews((current) => [newReview, ...current]);

        setSummary((current) => {
          const newTotal = current.totalReviews + 1;

          const newRatingCounts = {
            ...current.ratingCounts,
            [newReview.rating]:
              (current.ratingCounts?.[newReview.rating] || 0) + 1,
          };

          const newAverage =
            (current.averageRating * current.totalReviews +
              newReview.rating) /
            newTotal;

          return {
            averageRating: Number(newAverage.toFixed(1)),
            totalReviews: newTotal,
            ratingCounts: newRatingCounts,
          };
        });
      }

      setFormData({
        orderNumber: "",
        customerName: "",
        customerEmail: "",
        rating: 5,
        review: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Submit review error:", error);
      setError(error.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="vega-reviews">
      <div className="vega-reviews__header">
        <p className="vega-eyebrow">WHAT PEOPLE SAY</p>

        <h2>REVIEWS</h2>
      </div>

      <div className="vega-reviews__summary">
        <div className="vega-reviews__average">
          <strong>
            {summary.averageRating.toFixed(1)}
          </strong>

          <StarRating rating={summary.averageRating} />

          <span>
            {summary.totalReviews}{" "}
            {summary.totalReviews === 1 ? "review" : "reviews"}
          </span>
        </div>

        <div className="vega-reviews__breakdown">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = summary.ratingCounts?.[rating] || 0;

            const percentage =
              summary.totalReviews > 0
                ? (count / summary.totalReviews) * 100
                : 0;

            return (
              <div
                className="vega-reviews__rating-row"
                key={rating}
              >
                <span>{rating}★</span>

                <div className="vega-reviews__rating-bar">
                  <span
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="vega-reviews__actions">
        <button
          type="button"
          onClick={() => {
            setShowForm((current) => !current);
            setError("");
          }}
        >
          {showForm ? "CLOSE REVIEW" : "WRITE A REVIEW"}
        </button>
      </div>

      {showForm && (
        <motion.form
          className="vega-review-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="text"
            name="orderNumber"
            placeholder="Order number"
            value={formData.orderNumber}
            onChange={updateField}
            required
          />

          <input
            type="text"
            name="customerName"
            placeholder="Your name"
            value={formData.customerName}
            onChange={updateField}
            required
          />

          <input
            type="email"
            name="customerEmail"
            placeholder="Email used for the order"
            value={formData.customerEmail}
            onChange={updateField}
            required
          />

          <select
            name="rating"
            value={formData.rating}
            onChange={updateField}
            required
          >
            <option value="5">★★★★★ — 5</option>
            <option value="4">★★★★☆ — 4</option>
            <option value="3">★★★☆☆ — 3</option>
            <option value="2">★★☆☆☆ — 2</option>
            <option value="1">★☆☆☆☆ — 1</option>
          </select>

          <textarea
            name="review"
            placeholder="Tell us about your experience..."
            value={formData.review}
            onChange={updateField}
            minLength={5}
            maxLength={1000}
            required
          />

          {error && (
            <div className="vega-reviews__error">
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
          </button>
        </motion.form>
      )}

      {loading && (
        <div className="vega-reviews__state">
          Loading reviews...
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="vega-reviews__state">
          No reviews yet. Be the first to review this product.
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="vega-reviews__list">
          {reviews.map((review) => (
            <motion.article
              className="vega-review-card"
              key={review._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="vega-review-card__top">
                <StarRating rating={review.rating} />

                <span>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3>{review.customerName}</h3>

              <p>{review.review}</p>

              {review.verifiedPurchase && (
                <span className="vega-review-card__verification">
                  ✓ Verified Purchase
                </span>
              )}
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

function StarRating({ rating }) {
  const roundedRating = Math.round(rating);

  return (
    <span
      className="vega-star-rating"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= roundedRating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}

export default Reviews;