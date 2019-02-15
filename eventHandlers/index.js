const factoryQueries = require('../queries/factories')

const syncFactory = socket => res => {
  socket.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = socket => data => {
  const json = JSON.parse(data)
  console.log(json)
  factoryQueries.update(json)
    .then(factoryQueries.find)
    .then(res => syncFactory(socket)(res))
}

const initHandlers = socket => {
  socket.on('UPDATE_FACTORY', updateFactory(socket))
}

module.exports = initHandlers
