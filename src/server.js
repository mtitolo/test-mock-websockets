const async = require('async')
const express = require('express')
const http = require('http')
const WebSocket = require('ws')
const morgan = require('morgan')

const app = express()

const server = http.createServer(app)
const wss = new WebSocket.Server({
  server
})

app.use(morgan("combined"))

wss.on('connection', function connection(ws, req) {
  console.log('Connected')
  ws.on('message', function incoming(message) {
    console.log('pong')
    var request = JSON.parse(message)
    var repeat = request.num_greetings
    var reply = '{"message": "Hello ' + request.name + '"}'
    var queue = async.queue(function (message, callback) {
      try {
        ws.send(message)
        console.log(message)

        // introduce latency
        setTimeout(function () {
          callback()
        }, 100)
      } catch (err) {
        console.error(err)
      }


    })
    for (count = 0; count < repeat; count++) {
      queue.push(reply, function (err, result) {})
    }

    queue.drain = function () {
      ws.close()
    }
  })
})

app.get('/health', function (req, res) {
  res.send('Server is running')
})

server.listen(8080, function listening() {
  console.log('Listening on %d', server.address().port)
})