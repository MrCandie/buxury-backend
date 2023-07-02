const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "product must have a name"],
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      trim: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: null,
    },
    slug: String,
    image: {
      type: Array,
      default: [],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating cannot be below 1"],
      max: [5, "Rating cannot be above 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    units: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: [],
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
    store: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Store",
        required: [true, "product must belong to a store"],
      },
    ],
    storeId: {
      type: String,
      required: [true, "product must belong to a store"],
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

module.exports = mongoose.model("Product", productSchema);
