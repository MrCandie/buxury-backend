const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
    token: String,
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "team must belong to a user"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("OTP", OTPSchema);
