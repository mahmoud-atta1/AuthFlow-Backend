const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const hashToken = require("../utils/hashToken");
const ApiError = require("../utils/apiError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Login
// @route   POST /api/v1/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new ApiError("Incorrect Email or Password", 401));
  }

  if (!user.isVerified) {
    return next(new ApiError("Please verify your email first", 403));
  }

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  await User.findByIdAndUpdate(user._id, {
    refreshToken: hashToken(refreshToken),
  });

  user.password = undefined;
  res.status(200).json({
    status: "success",
    accessToken,
    refreshToken,
    data: user,
  });
});
