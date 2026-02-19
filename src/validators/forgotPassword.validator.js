const Joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

exports.forgotPasswordValidator = validatorMiddleware({
  body: forgotPasswordSchema,
});
