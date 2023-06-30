const express = require("express");
const {
  signup,
  login,
  verifyOTP,
  forgotPassword,
  resetPassword,
} = require("../controller/auth-controller");

const router = express.Router();

router.post("/register", signup);

router.post("/login", login);

router.post("/verify", verifyOTP);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
