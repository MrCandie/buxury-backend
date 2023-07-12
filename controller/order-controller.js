const https = require("https");
const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Store = require("../model/store-model");
const sendEmail = require("../util/send-email");
const Product = require("../model/product-model");
const Order = require("../model/order-model");
const Cart = require("../model/cart-model");

exports.createOrder = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const params = JSON.stringify({
    email: user.email,
    amount: req.body.price,
    callback_url: "https://buxury.vercel.app/products/success",
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

      resp.on("end", async () => {
        const orderData = JSON.parse(data);
        const requestBody = {
          order: req.body.order,
          price: req.body.price,
          reference: orderData.data.reference,
          ...req.body,
        };
        const order = await Order.create(requestBody);

        // await Cart.deleteMany({ userId: req.user.id });
        // const storeId = order.order[0]?.product[0]?.storeId;
        // const store = await Store.findById(storeId);
        // const user = await User.findById(order?.userId);

        // const message = `Dear ${store.name?.toUpperCase()}, You have a new order from ${user?.name?.toUpperCase()}\nProduct Name: order.order[0]?.product[0]?.name\nPrice: ${
        //   order.order[0]?.product[0]?.price
        // }\nQuantity: ${order.order[0]?.quantity}\nDelivery Address: ${
        //   order?.address
        // }\nLogin to your account to view your order here https://buxury.vercel.app/stores/${
        //   store?.slug
        // }`;

        // try {
        //   await sendEmail({
        //     to: store.email,
        //     subject: "New Order",
        //     html: message,
        //   });
        // } catch (error) {
        //   console.log(error);
        // }

        return res.status(200).json({
          data: JSON.parse(data),
          order,
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

exports.verifyOrder = catchAsync(async (req, res, next) => {
  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/:${req.params.reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  };

  https
    .request(options, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", async () => {
        // const order = await Order.findOne({ reference: req.params.reference });
        // console.log(order);
        return res.status(200).json({
          data: JSON.parse(data),
          // order,
        });
      });
    })
    .on("error", (error) => {
      return res.status(400).json({
        error,
      });
    });
});

exports.onSuccess = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ reference: req.params.reference });

  return res.status(200).json({
    status: "success",
    order,
  });
});

exports.getUserOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });

  return res.status(200).json({
    status: "success",
    orders,
  });
});

exports.viewOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("order not found", 404));
  }

  return res.status(200).json({
    status: "success",
    order,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const data = { status: req.body.status };
  const order = await Order.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runvalidators: true,
  });

  if (!order) {
    return next(new AppError("order not found", 404));
  }

  return res.status(200).json({
    status: "success",
    order,
  });
});
