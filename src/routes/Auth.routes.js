const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const { protect } = require("../middlewares/protect.middleware");

const { signupValidator } = require("../validators/signup.validator");
const { loginValidator } = require("../validators/login.validator");
const { forgotPasswordValidator } = require("../validators/forgotPassword.validator");
const { resetPasswordValidator } = require("../validators/resetPassword.validator");

const { signup } = require("../services/signup.service");
const { login } = require("../services/login.service");
const { sendVerificationEmail, verifyEmail } = require("../services/verifyEmail.service");
const { forgotPassword, resetPassword } = require("../services/forgotPassword.service");
const { logout } = require("../services/logout.service");
const { refreshAccessToken } = require("../services/refreshToken.service");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many attempts, please try again later.",
});

router.post("/signup", signupValidator, signup);

router.post("/login", authLimiter, loginValidator, login);

router.post("/send-verification", sendVerificationEmail);

router.post("/verify-email/:token", verifyEmail);

router.post("/forgotpassword", authLimiter, forgotPasswordValidator, forgotPassword);

router.post("/resetpassword/:token", authLimiter, resetPasswordValidator, resetPassword);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", protect, logout);

module.exports = router;
