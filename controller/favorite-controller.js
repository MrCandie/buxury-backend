const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Product = require("../model/product-model");
const Favorite = require("../model/favorite-model");

exports.addFavorite = catchAsync(async (req, res, next) => {
  const data = {
    user: req.user.id,
    userId: req.user.id,
    product: req.body.productId,
    productId: req.body.productId,
  };

  const favoriteExist = await Favorite.find({
    userId: req.user.id,
    productId: req.body.productId,
  });

  if (favoriteExist.length > 0) {
    return next(new AppError("product already in your favorites list", 400));
  }

  const favorite = await Favorite.create(data);

  return res.status(201).json({
    status: "success",
    favorite,
  });
});

exports.getFavorites = catchAsync(async (req, res, next) => {
  const favorites = await Favorite.find({ userId: req.user.id }).populate(
    "product"
  );

  return res.status(200).json({
    status: "success",
    data: {
      result: favorites.length,
      favorites,
    },
  });
});

exports.deleteFavorite = catchAsync(async (req, res, next) => {
  const favorite = await Favorite.deleteOne({
    productId: req.params.id,
    userId: req.user.id,
  });

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.checkProduct = catchAsync(async (req, res, next) => {
  const productExist = await Favorite.find({
    productId: req.body.productId,
    userId: req.user.id,
  });

  return res.status(200).json({
    status: "success",
    exists: productExist.length > 0 ? true : false,
  });
});
