const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Product = require("../model/product-model");
const Cart = require("../model/cart-model");

exports.createCart = catchAsync(async (req, res, next) => {
  const data = {
    product: req.body.productId,
    ...req.body,
  };

  let userCart = await Cart.findOne({
    productId: req.body.productId,
    userId: req.user.id,
  });

  const product = await Product.findById(req.body.productId);

  if (product.units <= 0) {
    return next(new AppError("insufficient quantity", 400));
  }

  if (userCart) {
    userCart.quantity = userCart.quantity + 1;
    product.units = product.units - 1;
    await product.save();
    await userCart.save();
  } else {
    userCart = await Cart.create(data);
    product.units = product.units - 1;
    await product.save();
    console.log(product.units);
  }

  return res.status(201).json({
    status: "success",
    data: userCart,
  });
});

exports.viewCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({ userId: req.user.id }).populate({
    path: "product",
    select: "name image price description units",
  });

  return res.status(200).json({
    status: "success",
    result: cart.length,
    data: cart,
  });
});

exports.removeCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  const product = await Product.findById(cart.productId);

  if (req.body.type === "reduce" && cart.quantity > 1) {
    cart.quantity = cart.quantity - 1;
    product.units = product.units + 1;
    await product.save();
    await cart.save();
  } else {
    await Cart.findByIdAndDelete(req.params.id);
    product.units = product.units + cart.quantity;
    await product.save();
  }

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.getProductCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.find({
    userId: req.user.id,
    productId: req.params.id,
  });

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.getTotalPrice = catchAsync(async (req, res, next) => {
  const userCart = await Cart.find({ userId: req.user.id }).populate({
    path: "product",
    select: "name price",
  });

  const totalAmount = userCart
    .map((el) => el.product[0].price * el.quantity)
    .reduce((acc, sum) => acc + sum, 0);

  return res.status(200).json({
    status: "success",
    amount: totalAmount,
  });
});
