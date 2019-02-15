const express = require('express')
const router = express.Router()
const factoryQueries = require('../queries/factories')

router.get('/', function(req, res, next) {
  factoryQueries.fetchAll()
    .then(data => {
      res.json({
        factories: data.rows
      })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({
        message: 'internal server error'
      })
    })
})

module.exports = router
