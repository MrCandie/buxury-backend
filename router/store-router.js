const express = require("express");
const {
  createStore,
  getUserStores,
  updateStore,
  viewStore,
  getAllStores,
} = require("../controller/store-controller");
const { setUserId, protect } = require("../middleware");

const router = express.Router();

router.post("/", protect, setUserId, createStore);
router.get("/all", getAllStores);

router.get("/me", protect, getUserStores);
router.get("/:slug", protect, viewStore);

router.patch("/me/update/:id", protect, updateStore);

module.exports = router;
