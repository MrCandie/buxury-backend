const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Store = require("../model/store-model");
const sendEmail = require("../util/send-email");
const uploadFile = require("../util/file-upload");
const Product = require("../model/product-model");
const cloudinary = require("cloudinary").v2;

exports.uploadImages = catchAsync(async (req, res, next) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
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
    data: product,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  return res.status(200).json({
    status: "success",
    data: products,
  });
});
