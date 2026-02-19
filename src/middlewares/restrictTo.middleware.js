const ApiError = require("../utils/apiError");

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new ApiError("User not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403),
      );
    }

    next();
  };
