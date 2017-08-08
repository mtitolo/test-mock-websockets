let express = require('express')
let websocket = require('ws')
let morgan = require('morgan')
let async = require('async')
let http = require('http')

const app = express()
app.server = http.createServer(app)

app.use(morgan("combined"))

const ws = new websocket('ws://localhost:8080', [], {})

ws.on('connection', function connection(ws, req) {
  console.log('Connected')
})

ws.on('message', function incoming(data, flags) {
  console.log(data);
  var response = JSON.parse(data);
  console.log('received: ' + response.message)
})

app.get('/greet', function (req, res) {
  ws.send('{"name":"panda","num_greetings":5}')
  res.status(203).send()
})

app.server.listen(process.env.PORT || 8888, () => {
  console.log(`Started on port ${app.server.address().port}`)
  app.emit("appStarted", null)
})

module.exports = app