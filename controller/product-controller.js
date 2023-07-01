const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Store = require("../model/store-model");
const sendEmail = require("../util/send-email");
const uploadFile = require("../util/file-upload");
const Product = require("../model/product-model");

exports.createProduct = catchAsync(async (req, res, next) => {});
