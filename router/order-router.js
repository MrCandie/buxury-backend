const express = require("express");
const { createOrder } = require("../controller/order-controller");
const { protect, setUserId } = require("../middleware");

const router = express.Router();

router.post("/", protect, setUserId, createOrder);

module.exports = router;
