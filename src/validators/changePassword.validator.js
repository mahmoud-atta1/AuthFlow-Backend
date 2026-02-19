const Joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

exports.changePasswordValidator = validatorMiddleware({
  body: changePasswordSchema,
});
