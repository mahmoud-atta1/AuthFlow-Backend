const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/user.model");
const APiError = require("../utils/apiError");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// @desc    Signup
// @route   POST /api/v1/auth/signup
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const emailDuplicated = await User.findOne({ email });
  if (emailDuplicated) {
    return next(new APiError("Email already exists", 409));
  }

  const user = new User({
    name,
    email,
    password,
  });

  const accessToken = generateAccessToken({ userId: user._id });
  const refreshToken = generateRefreshToken({ userId: user._id });

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  user.refreshToken = hashedRefreshToken;
  await user.save();

  user.password = undefined;
  res.status(201).json({
    status: "success",
    accessToken,
    refreshToken,
    data: user,
  });
});
