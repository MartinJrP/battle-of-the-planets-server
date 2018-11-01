import { assert, expect } from 'chai'
import sinon from 'sinon'

import GameServer from './../src/GameObjects/GameServer'
import GameSession from './../src/GameObjects/GameSession'
import Player from '../src/GameObjects/Player';
import socket from 'socket.io';

describe('GameServer', function () {

  var mockSessions: GameSession[] = []
  var server: GameServer
  var socket: SocketIO.Socket

  beforeEach(function () {
    mockSessions = [
      new GameSession('12345'),
      new GameSession('ABCDE'),
      new GameSession('GIJOE')
    ]
    server = new GameServer({} as SocketIO.Server)
    server.sessions = mockSessions
    socket = {
      join: function () {}
      } as unknown as SocketIO.Socket
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('createSession', function () {
    
    it('should add a new game session to the sessions array', function () {
      server.sessions = []
      server.createSession(socket, function () {})

      server.sessions.length.should.be.equal(1)
    })
    it('should return the id of the newly created session', function () {
      let spy = sinon.spy()
      server.sessions = []
      server.createSession(socket, spy)

      assert.isTrue(spy.calledWithMatch(server.sessions[0].id))
    })
    it('should join the current socket to the room for the new session', function (done) {
      socket.join = sinon.spy()

      server.createSession(socket, function (sessionId) {
        assert.isTrue(
          (socket.join as sinon.SinonSpy).calledWithExactly(sessionId),
          `Expected to join room ${sessionId}. Instead called with ${(socket.join as sinon.SinonSpy).args}`
        )
        done()
      })
    })
  })

  describe('joinSession', function () {
    it('should add new player to the correct game session', function (done) {
      server.joinSession('GIJOE', socket, function(res) {
        let session = mockSessions[2]
        let player = new Player(res.username)

        expect(session.players).to.deep.include(player)
        done()
      })
    })

    it('should join socket to room for session', function(done) {
      socket.join = sinon.spy()
      let testSessionId = 'GIJOE'

      server.joinSession(testSessionId, socket, function (res) {
        assert.isTrue(
          (socket.join as sinon.SinonSpy).calledWithExactly(testSessionId),
          `Expected to join room ${testSessionId}. Instead called socket.join with ${(socket.join as sinon.SinonSpy).args}. Maybe uncalled if empty.`
        )
        done()
      })
    })

    it('should return the auto-generated player name on sucess', function (done) {
      server.joinSession('GIJOE', socket, function (res) {
        expect(res.username).to.equal('Player 1')
      })
      server.joinSession('GIJOE', socket, function (res) {
        expect(res.username).to.equal('Player 2')
        done()
      })
    })

    it('should return an error if the session does not exist', function (done) {
      server.joinSession('BAD_SESSION', socket, function(response) {
        expect(response.error).to.equal('Session Not Found')
        done()
      })
    })
    
    it('should emit a player-added event')
  })
})