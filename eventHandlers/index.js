const factoryQueries = require('../queries/factories')
const factoryValidator = require('../lib/validators/factory')

const acknowledge = ack => () => ack({ ok: true })

const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const handleException = err => {
  socket.emit('exception', err)
  ack({ error: err })
}

const updateNumbers = count => data => {
  return factoryQueries.createNumbersFor({...data, count })
    .then(() => factoryQueries.find(data))
}

const createFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  console.log("PING")
  factoryQueries.create(json)
    .then(updateNumbers(json.count))
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(handleException)
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.update(json)
    .then(updateNumbers(json.count))
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(handleException)
}

const initHandlers = io => socket => {
  socket.use(factoryValidator)
  socket.on('UPDATE_FACTORY', updateFactory(socket, io))
  socket.on('CREATE_NEW_FACTORY', createFactory(socket, io))
}

module.exports = initHandlers
