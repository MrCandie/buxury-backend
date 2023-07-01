const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const Store = require("../model/store-model");
const sendEmail = require("../util/send-email");

exports.createStore = catchAsync(async (req, res, next) => {
  const storeExists = await Store.find({ name: req.body.name });
  const user = await User.findById(req.user.id);

  if (storeExists.length !== 0) {
    return next(new AppError("Store name taken", 400));
  }

  const store = await Store.create(req.body);

  const message = `Dear ${
    user.name || "user"
  }, you have successfully created your first store\nProceed to start uploading products\nHapp to have you on board`;

  try {
    await sendEmail({
      to: req.body.email,
      subject: "Store Created",
      html: message,
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({
    status: "success",
    data: store,
  });
});

exports.getUserStores = catchAsync(async (req, res, next) => {
  const stores = await Store.find({ userId: req.user.id });

  return res.status(200).json({
    status: "success",
    stores,
  });
});

exports.updateStore = catchAsync(async (req, res, next) => {
  const data = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    logo: req.body.logo,
  };
  const store = await Store.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!store) {
    return next(new AppError("Store not found", 404));
  }

  return res.status(200).json({
    status: "success",
    store,
  });
});