const http = require('http')
const Websocket = require('ws')
const morgan = require('morgan')
const express = require('express')
const debug = require('debug')('mock')

const app = express()
app.server = http.createServer(app)

app.use(morgan('combined'))
app.set('websocket-factory', () => {
  const ws = new Websocket('ws://localhost:8080', [], {})

  ws.on('connection', function connection(ws, req) {
    console.log('Connected')
  })

  ws.on('message', function incoming(data, flags) {
    console.log(data)
    var response = JSON.parse(data)
    console.log('received: ' + response.message)
  })

  return ws
})

app.get('/greet', function (req, res) {
  debug('/greet called')

  req.app.get('websocket-server').send('{"name":"panda","num_greetings":5}')
  res.status(203).send()
})

app.server.listen(process.env.PORT || 8888, () => {
  debug(`App running on port: ${app.server.address().port}`)

  // Initialize WebSocket via factory design so we can properly stub out the websocket server
  const webSocketFactory = app.get('websocket-factory')
  app.set('websocket-server', webSocketFactory())

  app.emit('appStarted', null)
})

module.exports = app
