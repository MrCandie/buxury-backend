const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      default: 1,
    },
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "cart must belong to a user"],
      },
    ],
    userId: {
      type: String,
      required: [true, "cart must belong to a user"],
    },
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "cart must belong to a product"],
      },
    ],
    productId: {
      type: String,
      required: [true, "cart must belong to a product"],
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Cart", cartSchema);
