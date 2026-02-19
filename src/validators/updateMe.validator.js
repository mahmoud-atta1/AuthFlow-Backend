const Joi = require("joi");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

const updateMeSchema = Joi.object({
  name: Joi.string().min(3).max(50),

  email: Joi.string().email(),
  profileImg: Joi.string(),

  role: Joi.forbidden(),
  password: Joi.forbidden(),
  refreshToken: Joi.forbidden(),
  isVerified: Joi.forbidden(),
});

exports.updateMeValidator = validatorMiddleware({
  body: updateMeSchema,
});
