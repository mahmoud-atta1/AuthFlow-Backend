const Joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),

  passwordConfirm: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Password confirmation is required",
    }),
});

exports.resetPasswordValidator = validatorMiddleware({
  body: resetPasswordSchema,
});
