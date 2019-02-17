const factoryQueries = require('../queries/factories')
const factoryValidator = require('../lib/validators/factory')
const {
  syncFactory,
  removeFactory,
  handleException
} = require('./emitters')

const acknowledge = ack => () => ack && ack({ ok: true })

const updateNumbers = count => data => {
  return factoryQueries.createNumbersFor({...data, count })
    .then(() => factoryQueries.find(data))
}

const createFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.create(json)
    .then(updateNumbers(json.count))
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(handleException(socket, ack))
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.update(json)
    .then(updateNumbers(json.count))
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(handleException(socket))
}

const archiveFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.archive(json)
    .then(removeFactory(socket, io))
    .then(acknowledge(ack))
    .catch(handleException(socket))
}

const initHandlers = io => socket => {
  socket.use(factoryValidator)
  socket.on('UPDATE_FACTORY', updateFactory(socket, io))
  socket.on('CREATE_NEW_FACTORY', createFactory(socket, io))
  socket.on('ARCHIVE_FACTORY', archiveFactory(socket, io))
}

module.exports = initHandlers
