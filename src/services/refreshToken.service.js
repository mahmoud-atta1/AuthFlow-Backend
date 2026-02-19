const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const hashToken = require("../utils/hashToken");
const { generateAccessToken } = require("../utils/generateToken");

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError("Refresh token is required", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return next(new ApiError("Invalid or expired refresh token", 401));
  }

  // Check token against DB
  const hashedRefreshToken = hashToken(refreshToken);

  const user = await User.findOne({
    _id: decoded.userId,
    refreshToken: hashedRefreshToken,
  });

  if (!user) {
    return next(new ApiError("Invalid refresh token", 401));
  }

  //  Generate new access token
  const accessToken = generateAccessToken({ userId: user._id });

  res.status(200).json({
    status: "success",
    accessToken,
  });
});
