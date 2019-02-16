const Joi = require('joi')
const schema = require('../schemas/factory')
const factoryQueries = require('../queries/factories')

const validateAgainstSchema = data => {
  return Joi.validate(data, schema, { abortEarly: false })
}

const acknowledge = ack => ack({ ok: true })

const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)
  const result = validateAgainstSchema(json)

  if (result.error) {
    return ack({
      ok: false,
      errors: result.error
    })
  }

  factoryQueries.update(json)
    .then(factoryQueries.find)
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(err => {
      ack({ error: err })
    })
}

const initHandlers = io => socket => {
  socket.on('UPDATE_FACTORY', updateFactory(socket, io))
}

module.exports = initHandlers
