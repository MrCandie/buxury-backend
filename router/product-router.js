const express = require("express");
const { setUserId, protect } = require("../middleware");
const {
  createProduct,
  uploadImages,
  viewProduct,
  getAllProducts,
} = require("../controller/product-controller");

const router = express.Router();

router.post("/", protect, setUserId, createProduct);
router.get("/:id", protect, viewProduct);

router.get("/all", getAllProducts);

router.post("/upload", protect, uploadImages);

module.exports = router;
