const express = require("express");
const {
  createOrder,
  verifyOrder,
  onSuccess,
  getUserOrders,
  viewOrder,
  updateOrder,
} = require("../controller/order-controller");
const { protect, setUserId } = require("../middleware");

const router = express.Router();

router.get("/verify/:reference", protect, verifyOrder);
router.get("/success/:reference", protect, onSuccess);
router.get("/user", protect, getUserOrders);
router.get("/:id", protect, viewOrder);
router.patch("/:id", protect, updateOrder);
router.post("/", protect, setUserId, createOrder);

module.exports = router;
