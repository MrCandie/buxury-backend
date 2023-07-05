const express = require("express");
const { setUserId, protect } = require("../middleware");
const {
  createProduct,
  uploadImages,
  viewProduct,
  getAllProducts,
  addProductReview,
} = require("../controller/product-controller");

const router = express.Router();

router.get("/all", getAllProducts);
router.post("/", protect, setUserId, createProduct);
router.get("/:id", protect, viewProduct);
router.post("/review", protect, addProductReview);

router.post("/upload", protect, uploadImages);

module.exports = router;
