const Joi = require("joi");
const schema = Joi.object({
  name: Joi.string().max(30).min(3).optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(10),
  //   password: Joi.string().regex(
  //     /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,12}$/
  //   ),
});

module.exports=schema