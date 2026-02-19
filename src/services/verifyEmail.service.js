const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/user.model");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const hashToken = require("../utils/hashToken");

// @desc    Send Verification Email
// @route   POST /api/v1/auth/send-verification
exports.sendVerificationEmail = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  if (user.isVerified) {
    return next(new ApiError("Email is already verified", 400));
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  user.emailVerifyToken = hashToken(verificationToken);
  user.emailVerifyExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.APP_FRONTEND_URL}/verify-email/${verificationToken}`;
  const message = `Welcome! Please verify your email by clicking the link below:\n${verifyUrl}\nIf you didn't create an account, please ignore this email!`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Email Verification (valid for 10 min)",
      text: message,
    });

    res.status(200).json({
      status: "success",
      message: "Verification link sent to email!",
    });
  } catch (err) {
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError(
        "There was an error sending the verification email. Try again later!",
        500,
      ),
    );
  }
});

// @desc    Verify Email
// @route   POST /api/v1/auth/verify-email/:token
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailVerifyToken: hashedToken,
    emailVerifyExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }

  user.isVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});
