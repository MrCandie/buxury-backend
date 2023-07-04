const express = require("express");
const { addReview } = require("../controller/review-controller");
const { protect } = require("../middleware");

const router = express.Router();

router.post("/", protect, addReview);

module.exports = router;
