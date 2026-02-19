const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");

// @desc    Logout
// @route   POST /api/v1/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError("Not authenticated", 401));
  }

  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});
