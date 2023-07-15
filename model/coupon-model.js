const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      default: null,
    },
    percentage: {
      type: Number,
      default: 10,
    },
    store: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: [true, "coupon must belong to a store"],
      },
    ],
    storeId: {
      type: String,
      required: [true, "coupon must belong to a store"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
