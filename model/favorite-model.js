const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
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
  product: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "favorite must belong to a product"],
    },
  ],
  productId: {
    type: String,
    required: [true, "favorite must belong to a product"],
  },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
