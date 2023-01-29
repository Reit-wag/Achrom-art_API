const Joi = require('joi');

const schema = Joi.object().keys({
    name:               Joi.string().required(),
    email:              Joi.string().email().required(),
    phone:              Joi.string().required(),
    question:           Joi.string().required()
});

module.exports = schema;