const Joi = require('joi')

const schema = {
  id: Joi.number(),
  name: Joi.string().required(),
  min: Joi.number().min(1).max(Joi.ref('max')).required(),
  max: Joi.number().min(Joi.ref('min')).required(),
  count: Joi.number().min(1).max(15),
  numbers: Joi.array()
}

module.exports = schema
