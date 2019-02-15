const pool = require('../db/pool')

const isolateResult = response => {
  return response && response.rows[0]
}

const find = ({ id }) => {
  const text = `
    WITH numbers AS (
      SELECT
        array_agg(value) AS numbers,
        factory_id
      FROM factory_numbers
      WHERE archived_at IS NULL
      GROUP BY factory_id
    )
    SELECT
      id,
      name,
      min,
      max,
      numbers
    FROM factories f
    JOIN numbers n
      ON n.factory_id = f.id
    WHERE archived IS NOT true
    AND id = $1
  `

  const values = [
    id
  ]

  const opts = {
    text,
    values
  }

  return pool.query(opts)
    .then(isolateResult)
}

const fetchAll = () => {
  const text = `
    WITH numbers AS (
      SELECT
        array_agg(value) AS numbers,
        factory_id
      FROM factory_numbers
      WHERE archived_at IS NULL
      GROUP BY factory_id
    )
    SELECT
      id,
      name,
      min,
      max,
      numbers
    FROM factories f
    JOIN numbers n
      ON n.factory_id = f.id
    WHERE archived IS NOT true
    ORDER BY created_at ASC;
  `

  return pool.query({ text })
}

//{"id":2,"name":"Updated","min":2,"max":300,"numbers":[111,222]}
const update = data => {
  const {
    id,
    name,
    min,
    max
  } = data

  const text = `
    UPDATE factories
    SET
      name = $2,
      min = $3,
      max = $4,
      updated_at = NOW()
    WHERE
      id = $1
    RETURNING *
  `

  const values = [
    id,
    name,
    min,
    max
  ]

  const opts = {
    text,
    values
  }

  return pool.query(opts)
    .then(isolateResult)
}

module.exports = {
  fetchAll,
  update
}
