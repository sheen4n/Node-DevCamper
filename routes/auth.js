const express = require("express");
const { register, login, getMe, forgotPassword, resetPassword, updateDetails, updatePassword, logout } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();


router.route("/register").post(register);

router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);
router.route("/updatedetails").put(protect, updateDetails);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/me").get(protect, getMe);
router.route("/logout").get(protect, logout);

module.exports = router;