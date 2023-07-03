const express = require("express");
const { setUserId, protect } = require("../middleware");
const {
  createCart,
  viewCart,
  removeCart,
  getProductCart,
  getTotalPrice,
} = require("../controller/cart-controller");

const router = express.Router();

router.get("/total-amount", protect, getTotalPrice);
router.get("/", protect, viewCart);

router.get("/:id", protect, getProductCart);

router.post("/", protect, setUserId, createCart);

router.post("/:id", protect, removeCart);

module.exports = router;
