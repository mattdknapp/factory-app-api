const pool = require('../db/pool')
const transaction = require('../lib/transaction')

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
    AND f.id = $1
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

const create = data => {
  const {
    name,
    min,
    max
  } = data

  const text = `
    INSERT INTO factories
      (name, min, max, created_at, updated_at)
    VALUES
      ($1, $2, $2, NOW(), NOW())
    RETURNING *
  `

  const values = [
    name,
    min,
    max
  ]

  const opts = {
    text,
    values
  }

  return pool.query(opts)
    .then(isolateResource)
}

const createNumbersFor = ({id, count}) => {
  const archiveText = `
    UPDATE factory_numbers
    SET archived_at = NOW()
    WHERE archived_at IS NULL
      AND factory_id = $1
  `

  const archiveValues = [
    id
  ]

  const archiveOpts = {
    text: archiveText,
    values: archiveValues
  }

  const createText = `
    INSERT INTO factory_numbers
      (factory_id, value, created_at)
    (SELECT
        $1,
        floor(random() * (f.max - f.min + 1) + f.min)::int,
        NOW()
      FROM generate_series(1, $2) gs
      JOIN factories AS f
        ON f.id = f.id
      WHERE f.id = $1)
  `

  const createValues = [
    id,
    count
  ]

  const createOpts = {
    text: createText,
    values: createValues
  }

  const queries = [
    archiveOpts,
    createOpts
  ]

  console.log("Just before")
  return transaction(queries)
}

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
  find,
  fetchAll,
  createNumbersFor,
  update
}
