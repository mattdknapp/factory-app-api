const factoryQueries = require('../queries/factories')

const syncFactory = (socket, transactionId) => res => {
  if (transactionId) {
    socket.emit('TRANSACTION_SUCCESSFUL', transactionId)
  }

  socket.emit('SYNC_FACTORY', JSON.stringify(res))
}

const updateFactory = socket => data => {
  const json = JSON.parse(data)
  const {
    transactionId
  } = json

  console.log(json)
  factoryQueries.update(json)
    .then(factoryQueries.find)
    .then(res => syncFactory(socket, transactionId)(res))
    .catch(err => {
      console.error(err)
      socket.emit('TRANSACTION_ERROR', transactionId)
    })
}

const initHandlers = socket => {
  socket.on('UPDATE_FACTORY', updateFactory(socket))
}

module.exports = initHandlers
