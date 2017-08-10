process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const debug = require('debug')('mock')
const Server = require('mock-socket').Server
const WebSocket = require('mock-socket').WebSocket

chai.use(chaiHttp)

describe('Mock WebSocket Test', () => { // eslint-disable-line no-undef
  beforeEach((done) => { // eslint-disable-line no-undef
    debug('beforeEach invoked')
    const app = require('../src/index')
    /*
     * Create a mock server that we will have the factory create instead
     * of the "real" server. We could also pass this Server class into a factory method
     * that then does the creation. This will allow us to share the websocket server logic
     * in both the tests and the "real" server.
     */
    const mockServer = new Server('ws://localhost:8080')

    /*
     *
     */
    app.set('websocket-factory', () => mockServer)
    app.on('appStarted', done)
  })

  it('test that when calling /greet a message is sent to the client', (done) => { // eslint-disable-line no-undef
    /*
     * Here we create a mock client that will recieve the communications from the mock server such that we can test
     * behavior
     */
    const mockClient = new WebSocket('ws://localhost:8080')
    let callbacksInvoked = 0

    mockClient.onmessage = function(event) {
      debug('onMessage callback was invoked')

      chai.expect(event.data).to.equal('{"name":"panda","num_greetings":5}')
      callbacksInvoked += 1
    }

    chai
      .request('http://localhost:8888')
      .get('/greet')
      .end((error, res) => {
        chai.expect(error).to.be.null
        chai.expect(res.statusCode).to.equal(203)
        chai.expect(res.body).to.deep.equal({})
        chai.expect(callbacksInvoked).to.equal(1)
        done()
      })
  })
})
