const bcrypt = require("bcryptjs");
const OTP = require("./../model/otp-model");

async function generateToken(userId) {
  const token = Math.floor(1000 + Math.random() * 9000).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(token, salt);
  await OTP.create({
    userId,
    otp: hashedOTP,
    token,
    user: userId,
    createdAt: Date.now(),
    expiresAt: Date.now() + 600000,
  });

  return token;
}

module.exports = generateToken;
