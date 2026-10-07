import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
{
productId: {
type: String,
required: true,
index: true,
trim: true,
},

orderNumber: {
  type: String,
  required: true,
  index: true,
  trim: true,
},

customerName: {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 80,
},

customerEmail: {
  type: String,
  required: true,
  trim: true,
  lowercase: true,
},

rating: {
  type: Number,
  required: true,
  min: 1,
  max: 5,
  validate: {
    validator: Number.isInteger,
    message: "Rating must be a whole number between 1 and 5.",
  },
},

review: {
  type: String,
  required: true,
  trim: true,
  minlength: 5,
  maxlength: 1000,
},

verifiedPurchase: {
  type: Boolean,
  default: false,
},

status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
  index: true,
},

},
{
timestamps: true,
}
);

reviewSchema.index({
productId: 1,
status: 1,
createdAt: -1,
});

reviewSchema.index(
  {
    productId: 1,
    orderNumber: 1,
    customerEmail: 1,
  },
  {
    unique: true,
  }
);

const Review = mongoose.model(
"Review",
reviewSchema
);

export default Review;
