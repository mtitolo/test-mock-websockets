process.env.NODE_ENV = 'test'

let chai = require('chai')
let Server = require('mock-socket').Server
let chaiHttp = require('chai-http')
let WebSocket = require('mock-socket').WebSocket

let should = chai.should()
chai.use(chaiHttp)

describe('Mock websocket test', () => {
  var mockServer, app
  before(function() {
    // This doesn't work
    // Run src/server.js to see live requests still going through even though they are mocked
    mockServer = new Server('ws://127.0.0.1:8080')
    mockServer.on('connection', server => {
      console.log("successfully connected to mock socket")
    })
    mockServer.on('message', function incoming(data, flags) {
      let json = {
        message: "Hello Chewie"
      }
      mockServer.send(JSON.stringify(json))
    })

    // End mocking code
  })

  beforeEach(function(done){
    app = require('../src/index')

    app.on("appStarted", function () {
      done()
    })
  })

  it('basic test', (done) => {
    chai.request('http://localhost:8888')
      .get('/greet').end((error, res) => {
        if (error) {
          console.log(error)
          return done(error)
        }

        res.statusCode.should.equal(203)

        res.body.should.be.empty
        done()
      })
  })
})