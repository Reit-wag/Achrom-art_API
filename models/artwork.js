const Joi = require('joi');

const schema = Joi.object().keys({
    name:               Joi.string().required(),
    style:              Joi.string(),
    description:        Joi.string(),
    year:               Joi.number().less(2024),
    src:                Joi.string().required()
});

module.exports = schema;