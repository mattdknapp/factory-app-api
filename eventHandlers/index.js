const factoryQueries = require('../queries/factories')
const factoryValidator = require('../lib/validators/factory')

const acknowledge = ack => () => ack({ ok: true })

const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.update(json)
    .then(() => {
      return factoryQueries.createNumbersFor({...json, count: 5})
    })
    .then(() => {
      return factoryQueries.find(json)
    })
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(err => {
      socket.emit('exception', err)
      ack({ error: err })
    })
}

const initHandlers = io => socket => {
  socket.use(factoryValidator)
  socket.on('UPDATE_FACTORY', updateFactory(socket, io))
}

module.exports = initHandlers
