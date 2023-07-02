const express = require("express");
const { setUserId, protect } = require("../middleware");
const {
  createCart,
  viewCart,
  removeCart,
} = require("../controller/cart-controller");

const router = express.Router();

router.get("/", protect, viewCart);

router.post("/", protect, setUserId, createCart);

router.post("/:id", protect, removeCart);

module.exports = router;
