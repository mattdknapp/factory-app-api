const factoryQueries = require('../queries/factories')

const syncFactory = socket => res => {
  socket.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = socket => (data, ack) => {
  const json = JSON.parse(data)

  console.log(json)
  factoryQueries.update(json)
    .then(factoryQueries.find)
    .then(syncFactory(socket))
    .then(() => ack({ ok: true }))
    .catch(err => {
      console.error(err)
      ack({ error: err })
    })
}

const initHandlers = socket => {
  socket.on('UPDATE_FACTORY', updateFactory(socket))
}

module.exports = initHandlers
