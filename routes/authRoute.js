const express = require("express");
const verifyAdminAuthentication = require("../middlewares/verifyAdmin");
const router = express.Router();
const {
  register,
  login,
  changePassword,
  sendPasswordResetEmail,
  resetPassword,
  showAdminProfile,
} = require("../controllers/authController");

//protected routes
// router.post("/change-password", verifyAdminAuthentication);
// router.get("/admin-profile", verifyAdminAuthentication);

// router.get("/admin-profile", showAdminProfile);

//routes
router.post("/admin-registration", register);
router.post("/admin-login", login);
router.post("/change-password", changePassword);
router.post("/send-reset-email", sendPasswordResetEmail);
router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;
