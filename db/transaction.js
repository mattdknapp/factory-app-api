const pool = require('./pool')

const executeQuery = (client, query) => {
  const {
    text,
    values
  } = query

  return () => pool.query({ text, values })
}

const resolveSequentially = (executeWithClient) => {
  return (previousQuery, nextQuery) => {
    if (!previousQuery) {
      return executeWithClient(nextQuery)()
    }

    if (!nextQuery) {
      return previousQuery
    }

    return previousQuery
      .then(executeWithClient(nextQuery))
  }
}

const transaction = (queries, client) => {
  const queryWithClient = (query) => executeQuery(client, query)

  const beginTransaction = () => client.query({ text: 'BEGIN' })

  const commitTransaction = finalQueryResults => {
    client.query({ text: 'COMMIT' })
    return finalQueryResults
  }

  const resolveQueries = () => queries.reduce(resolveSequentially(queryWithClient), null)

  const closeConnection = finalQueryResults => {
    client.release()
    return finalQueryResults
  }

  const throwError = err => {
    throw (err)
  }

  return beginTransaction()
    .then(resolveQueries)
    .then(commitTransaction)
    .catch(throwError)
    .finally(closeConnection)
}

const runTransaction = (queries) => {
  return pool.connect()
    .then(client => {
      return transaction(queries, client)
    })
}

module.exports = runTransaction
