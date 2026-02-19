const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

const User = require("../models/user.model");

const hashToken = require("../utils/hashToken");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError("There is no user with that email address", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.APP_FRONTEND_URL}/reset-password/${resetToken}`;
  const message = `Forgot your password? Submit a request with your new password to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Your password reset token (valid for 10 min)",
      text: message,
    });

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ApiError(
        "There was an error sending the email. Try again later!",
        500,
      ),
    );
  }
});

// @desc    Reset password
// @route   POST /api/v1/auth/resetpassword/:token
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const hashedToken = hashToken(req.params.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Token is invalid or has expired", 400));
  }

  if (!user.isVerified) {
    return next(new ApiError("Please verify your email first", 403));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000;

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });
  user.refreshToken = hashToken(refreshToken);

  await user.save();

  user.password = undefined;
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
  });
});
