const express = require("express");
const {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
  resendOtp,
  updatePassword,
} = require("../controller/auth-controller");

const { protect } = require("../middleware");

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

router.post("/verify", verifyOTP);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.post("/resend-otp", resendOtp);

router.post("/update-password", protect, updatePassword);

module.exports = router;
