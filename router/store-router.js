const express = require("express");
const {
  createStore,
  getUserStores,
  updateStore,
} = require("../controller/store-controller");
const { setUserId, protect } = require("../middleware");

const router = express.Router();

router.post("/", protect, setUserId, createStore);

router.get("/me", protect, getUserStores);

router.patch("/me/update/:id", protect, updateStore);

module.exports = router;
