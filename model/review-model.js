const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "product must belong to a user"],
      },
    ],
    userId: {
      type: String,
      required: [true, "product must belong to a user"],
    },
    productId: {
      type: String,
      required: [true, "favorite must belong to a product"],
    },
    review: {
      type: String,
      required: [true, "add a comment"],
    },
    rating: {
      type: Number,
      required: [true, "add a rating"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Review", reviewSchema);
