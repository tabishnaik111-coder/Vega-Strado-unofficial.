import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";

const router = express.Router();

/*
  GET APPROVED REVIEWS FOR A PRODUCT
  GET /api/reviews/:productId
*/
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      productId,
      status: "approved",
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : 0;

    const ratingCounts = {
      5: reviews.filter((review) => review.rating === 5).length,
      4: reviews.filter((review) => review.rating === 4).length,
      3: reviews.filter((review) => review.rating === 3).length,
      2: reviews.filter((review) => review.rating === 2).length,
      1: reviews.filter((review) => review.rating === 1).length,
    };

    return res.json({
      success: true,
      summary: {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews,
        ratingCounts,
      },
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

/*
  SUBMIT VERIFIED REVIEW
  POST /api/reviews
*/
router.post("/", async (req, res) => {
  try {
    const {
      productId,
      orderNumber,
      customerName,
      customerEmail,
      rating,
      review,
    } = req.body;

    const normalizedProductId = String(productId || "").trim();
    const normalizedOrderNumber = String(orderNumber || "").trim();
    const normalizedName = String(customerName || "").trim();
    const normalizedEmail = String(customerEmail || "")
      .trim()
      .toLowerCase();
    const normalizedReview = String(review || "").trim();
    const normalizedRating = Number(rating);

    /*
      BASIC VALIDATION
    */
    if (
      !normalizedProductId ||
      !normalizedOrderNumber ||
      !normalizedName ||
      !normalizedEmail ||
      !normalizedReview
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all review fields.",
      });
    }

    if (!Number.isInteger(normalizedRating) || normalizedRating < 1 || normalizedRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (normalizedName.length < 2 || normalizedName.length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 80 characters.",
      });
    }

    if (normalizedReview.length < 5 || normalizedReview.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review must be between 5 and 1000 characters.",
      });
    }

    /*
      FIND REAL ORDER
    */
    const order = await Order.findOne({
      orderNumber: normalizedOrderNumber,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    /*
      VERIFY CUSTOMER EMAIL
    */
    const orderEmail = String(order.customer?.email || "")
      .trim()
      .toLowerCase();

    if (!orderEmail || orderEmail !== normalizedEmail) {
      return res.status(403).json({
        success: false,
        message: "The email does not match the order.",
      });
    }

    /*
      VERIFY PRODUCT WAS ACTUALLY ORDERED
    */
    const purchasedProduct = order.items?.some(
      (item) => String(item.productId) === normalizedProductId
    );

    if (!purchasedProduct) {
      return res.status(403).json({
        success: false,
        message: "This product was not included in the order.",
      });
    }

    /*
      PREVENT DUPLICATE REVIEW
    */
    const existingReview = await Review.findOne({
      productId: normalizedProductId,
      orderNumber: normalizedOrderNumber,
      customerEmail: normalizedEmail,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product from this order.",
      });
    }

    /*
      AUTOMATICALLY APPROVE VERIFIED REVIEW
    */
    const newReview = await Review.create({
      productId: normalizedProductId,
      orderNumber: normalizedOrderNumber,
      customerName: normalizedName,
      customerEmail: normalizedEmail,
      rating: normalizedRating,
      review: normalizedReview,
      verifiedPurchase: true,
      status: "approved",
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    /*
      Handles the unique MongoDB index if two identical
      submissions happen at nearly the same time.
    */
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product from this order.",
      });
    }

    console.error("Submit review error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
});

export default router;