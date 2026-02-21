const router = require("express").Router();
const verifyEmail = require("../controllers/verifyEmail");
const resetPassword = require("../helper/resetPassword")
const multer = require("multer");
const upload = multer();

const { registerUser, userLogin, forgetPassword, getAllUsers } = require("../controllers/authController");
const authGuard = require("../helper/authguard");
const isAdmin = require("../helper/isAdmin");
// const { getallUsersApi } = require("../../fiintrack-frontend/src/services/api");

router.post("/register", registerUser);
router.get("/verify-email",authGuard, verifyEmail);
router.post("/login", userLogin);
router.post("/forgetPassword", forgetPassword);
router.post("/reset-password", resetPassword);
router.get("/getalluser",authGuard,isAdmin, getAllUsers);


module.exports = router;