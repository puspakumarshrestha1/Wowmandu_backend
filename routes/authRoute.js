const express = require("express");
const verifyAdminAuthentication = require("../middlewares/verifyAdmin");
const router = express.Router();
const {
  register,
  login,
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
} = require("../controllers/authController");

//protected routes
router.post("/change-password",verifyAdminAuthentication);

//routes
router.post("/admin-registration", register);
router.post("/admin-login", login);
router.post("/change-password", changePassword);
router.post("/send-reset-email", sendPasswordResetEmail);
router.post("/reset-password", resetPassword);

module.exports = router;
