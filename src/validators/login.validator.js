const Joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

exports.loginValidator = validatorMiddleware({
  body: loginSchema,
});