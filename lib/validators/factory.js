const Joi = require('joi')
const schema = require('../schemas/factory')

const validateAgainstSchema = data => {
  return Joi.validate(data, schema, { abortEarly: false })
}

const validatedActions = [
  'UPDATE_FACTORY',
  'CREATE_FACTORY'
]

const validationChecker = (packet, next) => {
  const [
    action,
    data
  ] = packet

  const shouldValidate = validatedActions.includes(action)

  if (shouldValidate) {
    const json = JSON.parse(data)
    const validation = validateAgainstSchema(json)

    if (validation.error) {
      const joiError = new Error(JSON.stringify(validation.error))
      return next(joiError)
    }
  }

  return next()
}

module.exports = validationChecker
