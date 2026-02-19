const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const hashToken = require("../utils/hashToken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Get current logged user
// @route   GET /api/v1/users/me
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    status: "success",
    data: user,
  });
});

// @desc    Update logged user data
// @route   PATCH /api/v1/users/update-me
exports.updateMe = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

// @desc    Delete logged user account
// @route   DELETE /api/v1/users/delete-me
exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(204).json({
    status: "success",
    message: "Account deleted successfully",
  });
});

// @desc    Change password while logged in
// @route   PATCH /api/v1/users/change-password
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new ApiError("Current password is incorrect", 401));
  }

  user.password = newPassword;
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
