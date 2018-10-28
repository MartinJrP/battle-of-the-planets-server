import { assert } from 'chai'
import GameServer from './../src/GameObjects/GameServer'
import sinon from 'sinon'

describe.only('GameServer', function () {
  describe('createSession', function () {

    var server: GameServer

    beforeEach (function () {
      server = new GameServer()
    })
    
    it('should add a new game session to the sessions array', function () {
      let socket = {} as SocketIO.Socket
      server.createSession(socket, function () {})

      server.sessions.length.should.be.equal(1)
    })
    it('should return the id of the newly created session', function () {
      let spy = sinon.spy();
      let socket = {} as SocketIO.Socket
      server.createSession(socket, spy)

      assert.isTrue(spy.calledWithMatch(server.sessions[0].id))
    })
    it('should ensure a game session with the created id doesn\'t exisit')
  })
})