const bcrypt = require("bcryptjs");
const OTP = require("./../model/otp-model");
const AppError = require("./../util/app-error");

async function verifyToken(userId, token, next) {
  const userOtpRecord = await OTP.findOne({ userId: userId });

  if (!userOtpRecord) {
    return next(
      new AppError(
        "account record does not exist or has been verified, please sign up or login",
        200
      )
    );
  }

  if (userOtpRecord.expiresAt < Date.now()) {
    await OTP.deleteMany({ userId });
    return next(new AppError("Code has expired, request again", 400));
  }

  return await bcrypt.compare(token, userOtpRecord.otp);
}

module.exports = verifyToken;
