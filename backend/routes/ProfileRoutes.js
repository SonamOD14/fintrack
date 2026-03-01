const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profileController");
const authGuard = require("../middleware/authguard");

router.get("/get", authGuard, getProfile);
router.put("/update", authGuard, updateProfile);

module.exports = router;