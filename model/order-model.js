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
    address: {
      type: String,
      required: [true, "order must have delivery address"],
    },
    status: {
      type: String,
      default: "pending",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    reference: {
      type: String,
      required: [true, "order reference missing"],
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
