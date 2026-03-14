const express = require("express");
const { getProfile, updateIncome } = require("../controllers/profileController");
const protectedRoute = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protectedRoute, getProfile);
router.put("/income", protectedRoute, updateIncome);

module.exports = router;
