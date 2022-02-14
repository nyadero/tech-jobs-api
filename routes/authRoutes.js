const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authMiddleWare } = require("../Middleware/authMiddleware");

// register route
router.post("/register-user", authController.registerUser);

// login route
router.post("/login-user", authController.loginUser);

// forgot password route
router.post("/forgot-password", authController.forgotPassword);

// reset password
router.post("/reset-password/:resetToken", authController.resetPassword);

// update password
router.put("/update-password", authMiddleWare, authController.updatePassword);

// delete user
router.delete("/delete-user", authMiddleWare, authController.deleteUser);

module.exports = router;