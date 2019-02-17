const syncFactory = (socket, io) => res => {
  io.sockets.emit('SYNC_FACTORY', JSON.stringify(res))
}

const removeFactory = (socket, io) => data => {
  const {
    id
  } = data

  io.sockets.emit('REMOVE_FACTORY', JSON.stringify({ id }))
}

const handleException = (socket, ack) => err => {
  console.error(err)
  socket.emit('exception', err)
}

module.exports = {
  syncFactory,
  removeFactory,
  handleException
}
