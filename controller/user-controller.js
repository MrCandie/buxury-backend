const AppError = require("./../util/app-error");
const catchAsync = require("./../util/catch-async");
const User = require("./../model/user-model");

// UPDATE USER
exports.updateUser = catchAsync(async (req, res, next) => {
  const data = {
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
  };

  const user = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  return res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
