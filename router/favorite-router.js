const express = require("express");
const { protect } = require("../middleware");
const {
  addFavorite,
  deleteFavorite,
  getFavorites,
} = require("../controller/favorite-controller");

const router = express.Router();

router.route("/").get(protect, getFavorites).post(protect, addFavorite);

router.post("/:id", protect, deleteFavorite);

module.exports = router;
