const factoryQueries = require('../queries/factories')

const acknowledge = ack => ack({ ok: true })

const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = (socket, io) => (data, ack) => {
  const json = JSON.parse(data)

  factoryQueries.update(json)
    .then(factoryQueries.find)
    .then(syncFactory(socket, io))
    .then(acknowledge(ack))
    .catch(err => {
      console.error(err)
      ack({ error: err })
    })
}

const initHandlers = io => socket => {
  socket.on('UPDATE_FACTORY', updateFactory(socket, io))
}

module.exports = initHandlers
