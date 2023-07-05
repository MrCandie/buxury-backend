const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order: {
      type: Array,
      required: [true, "order must contain products"],
    },
    price: {
      type: Number,
      required: [true, "price missing"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Order", orderSchema);
