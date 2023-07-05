const https = require("https");
const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Store = require("../model/store-model");
const sendEmail = require("../util/send-email");
const uploadFile = require("../util/file-upload");
const Product = require("../model/product-model");
const Order = require("../model/order-model");

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  const user = await User.findById(req.user.id);

  const params = JSON.stringify({
    email: user.email,
    amount: req.body.price,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const request = https
    .request(options, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        return res.status(200).json({
          data: JSON.parse(data),
        });
      });
    })
    .on("error", (error) => {
      return res.status(400).json({
        error,
      });
    });

  request.write(params);
  request.end();
});

exports.verifyOrder = catchAsync(async (req, res, next) => {});
