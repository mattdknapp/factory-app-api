require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').Server(app, { path: '/socket' })
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const io = require('socket.io')(http)

const indexRouter = require('./routes/index')
const eventHandlers = require('./eventHandlers/index')

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
io.on('connection', eventHandlers)

//module.exports = app

http.listen(3001)
