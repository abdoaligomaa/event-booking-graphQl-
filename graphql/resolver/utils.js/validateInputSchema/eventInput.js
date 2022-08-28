const Joi = require("joi");
const schema = Joi.object({
    title:Joi.string().max(500).min(5).required(),
    description:Joi.string().max(1000).min(20).required(),
    price:Joi.number().integer().optional(),
    date:Joi.date().required()
});

module.exports = schema;
