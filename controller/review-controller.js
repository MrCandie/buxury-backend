const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Product = require("../model/product-model");
const Favorite = require("../model/favorite-model");
const Review = require("../model/review-model");

exports.addReview = catchAsync(async (req, res, next) => {
  const data = {
    user: req.user.id,
    userId: req.user.id,
    productId: req.body.productId,
    review: req.body.review,
    ...req.body,
  };

  const review = await Review.create(data);

  return res.status(201).json({
    status: "success",
    review,
  });
});
