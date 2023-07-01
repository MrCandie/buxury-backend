const User = require("./model/user-model");
const catchAsync = require("./util/catch-async");
const AppError = require("./util/app-error");
const jwt = require("jsonwebtoken");

// PROTECT ROUTE
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("unauthenticated", 401));
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
  } catch (error) {
    return next(new AppError("Your login token is invalid", 401));
  }
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("user no longer exist", 404));
  }

  if (user.passwordChanged(decoded.iat)) {
    next(
      new AppError(
        "User recently changed password, login again to continue",
        401
      )
    );
  }

  req.user = user;
  next();
});

// SET USER ID
exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.userId) req.body.userId = req.user.id;
  next();
};
