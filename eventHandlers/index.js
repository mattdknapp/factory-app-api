const factoryQueries = require('../queries/factories')
const factoryValidator = require('../lib/validators/factory')

const acknowledge = ack => () => ack({ ok: true })

const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)
  const updateNumbers = () => factoryQueries.createNumbersFor(json)
  const getNewestFactoryState = () => factoryQueries.find(json)

  factoryQueries.update(json)
    .then(updateNumbers)
    .then(getNewestFactoryState)
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
