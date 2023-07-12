const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");
const sendEmail = require("./../util/send-email");
const OTP = require("./../model/otp-model");
const generateToken = require("./../util/generate-token");
const verifyToken = require("./../util/verify-token");
const createSendToken = require("../util/jwt");
const Store = require("../model/store-model");
const crypto = require("crypto");

// SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(
      new AppError(
        "Provide your email address or phone number to receive verification code",
        400
      )
    );
  }

  let user;

  if (req.body.email) {
    user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(
        new AppError("User with this email address exists already.", 400)
      );
    }
  }

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = await generateToken(newUser.id);

  const message = `Dear ${
    newUser.name || ""
  }, your Buxury account is registered, Use this code ${token} to verify your account. Expires in 10minutes`;

  const userHasStore = await Store.find({ userId: newUser.id });

  if (userHasStore.length > 0) {
    newUser.hasStore = true;
  } else {
    newUser.hasStore = false;
  }

  await newUser.save();

  try {
    await sendEmail({
      to: req.body.email,
      subject: "Welcome to Buxury",
      html: message,
    });
  } catch (error) {
    console.log(error);
  }

  createSendToken(newUser, 201, res);
});

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.email) {
    return next(new AppError("Login details cannot be empty", 400));
  }

  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  if (!(await user.verifyPassword(req.body.password, user.password))) {
    return next(new AppError("Incorrect credentials", 401));
  }

  const userHasStore = await Store.find({ userId: user.id });

  if (userHasStore.length > 0) {
    user.hasStore = true;
  } else {
    user.hasStore = false;
  }

  await user.save();

  createSendToken(user, 200, res);
});

exports.verifyOTP = catchAsync(async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token) {
    return next(new AppError("empty token details are not allowed"));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError("user not found", 404));
  }

  const isVerified = await verifyToken(user.id, token, next);

  if (!isVerified) {
    return next(new AppError("code entered is invalid, try again", 400));
  }
  await OTP.deleteMany({ userId: user.id });

  user.emailIsVerified = true;

  user.verifiedAt = Date.now();
  await user.save();

  createSendToken(user, 200, res);
});

// FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(
      new AppError("Please enter your registered email address", 400)
    );
  }

  const user = await User.findOne({ email });

  const token = user.createPasswordResetToken();
  console.log(token);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `https://buxury.vercel.app/auth/reset-password/${token}`;

  const message = `Dear User, complete your password reset by clicking on this link ${resetUrl}`;

  if (!user) {
    return next(new AppError("user with email address not found", 404));
  }

  try {
    const response = await sendEmail({
      to: user.email,
      subject: "Reset password",
      html: message,
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({
    status: "success",
    message: "reset token sent to email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password, passwordConfirm } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");

  if (!user) next(new AppError("Token is invalid or expired", 400));

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("empty user details are not allowed"));
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("User with this email not found", 404));
  }

  await OTP.deleteMany({ userId: user.id });
  const token = await generateToken(user.id);

  const message = `Dear User, your verification code is ${token}. Expires in 10mins`;

  await sendEmail({
    to: user.email,
    subject: "Verification code",
    html: message,
  });

  await user.save();

  return res.status(200).json({
    status: "pending",
    data: {
      message: "verification token sent",
      userId: user.id,
    },
  });
});

// UPDATE PASSWORD
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, oldPassword } = req.body;

  if (!password || !oldPassword) {
    return next(new AppError("password details cannot be empty", 400));
  }
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("user not found", 404));
  }

  if (!(await user.verifyPassword(oldPassword, user.password))) {
    return next(new AppError("Incorrect password", 401));
  }

  user.password = password;
  await user.save();

  return res.status(200).json({
    status: "success",
    message: "Password successfully updated",
  });
});
