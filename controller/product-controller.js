const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Product = require("../model/product-model");
const cloudinary = require("cloudinary").v2;
const Review = require("../model/review-model");

exports.uploadImages = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(
    req.files?.image.tempFilePath,
    {
      use_filename: true,
      folder: "buxury",
    }
  );

  return res.status(201).json({ status: "success", data: result.secure_url });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const data = {
    store: req.body.storeId,
    ...req.body,
  };

  const product = await Product.create(data);

  return res.status(201).json({
    status: "success",
    data: product,
  });
});

exports.viewProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: "store",
    select: "name image",
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  }

  return res.status(200).json({
    status: "success",
    data: { product },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    status: "success",
    data: products,
  });
});

exports.addProductReview = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.body.productId);

  const userAlreadyReviewd = product.reviews.filter(
    (el) => el.userId === req.user.id
  );

  if (userAlreadyReviewd.length > 0) {
    return next(new AppError("You already reviewed this product", 400));
  }

  const user = await User.findById(req.user.id).select("name");

  if (!req.body.review || !req.body.rating) {
    return next(
      new AppError(
        "enter a valid review(must contain a comment and rating)",
        400
      )
    );
  }

  const userObj = {
    review: req.body.review,
    userId: req.user.id,
    user: user.name,
    createdAt: Date.now(),
    rating: req.body.rating,
  };

  product.reviews.push(userObj);

  await product.save();

  return res.status(201).json({
    status: "success",
    product,
  });
});
