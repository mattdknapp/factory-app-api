require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/index')

const app = express()
const corsOpts = {
  origin: 'http://localhost:3000',
  optionSuccessStatus: 200
}

app.use(logger('dev'))
app.use(cors(corsOpts))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)

module.exports = app
