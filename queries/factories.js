const pool = require('../db/pool')


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

module.exports = {
  fetchAll
}
