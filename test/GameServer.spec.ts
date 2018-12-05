import { assert, expect } from 'chai'
import sinon from 'sinon'

import GameServer from './../src/GameObjects/GameServer'
import GameSession from './../src/GameObjects/GameSession'
import Player from '../src/GameObjects/Player';
import socket_io from 'socket.io';
import * as Errors from './../src/Errors'
import * as Constants from './../src/Constants'

describe('GameServer', function () {

  var mockSessions: GameSession[] = []
  var server: GameServer
  var socket: SocketIO.Socket
  var io: SocketIO.Server

  beforeEach(function () {
    mockSessions = [
      new GameSession('12345'),
      new GameSession('ABCDE'),
      new GameSession('GIJOE')
    ]
    io = socket_io()
    //io = sinon.stub(socket_io())
    server = new GameServer(io)
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
        let player = new Player(res.username, 1)

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
        expect(res).to.deep.equal({ username: 'Player 1', num: 1 })
      })
      server.joinSession('GIJOE', socket, function (res) {
        expect(res).to.deep.equal({ username: 'Player 2', num: 2 })
        done()
      })
    })

    it('should return an error if the session does not exist', function (done) {
      server.joinSession('BAD_SESSION', socket, function(response) {
        expect(response.error).to.equal('Session Not Found')
        done()
      })
    })
    
    it('should emit a player-added event with the player\'s username to the correct room', function (done) {
      let toStub = sinon.stub()
      let emitSpy = sinon.spy()

      let testSession = 'GIJOE'

      server.io.to = toStub.returns({
        emit: emitSpy
      })

      server.joinSession(testSession, socket, function (res) {
        assert.isTrue(
          toStub.calledWithExactly(testSession), 
          'Called io.to with ' + toStub.args + 'instead of ' + testSession)

        assert.isTrue(
          emitSpy.calledWithExactly('player-added', res),
          'Called io.to with ' + emitSpy.args + 'instead of \'player-added\'')
        done()
      })

    })

    it('should return an error if the max players per session has been reached', function (done) {
      for (let i = 0; i < Constants.MAX_PLAYER_COUNT; i++) {
        server.joinSession('GIJOE', socket, (response) => undefined)
      }
      server.joinSession('GIJOE', socket, function(response) {
        expect(response.error).to.equal('Max player count reached.')
        done()
      })
    })
  })

  describe('updateUsername', function () {
    it('should update the username of the correct player', function () {
      let session = mockSessions[0]

      session.addPlayer(new Player('Player 1', 1))
      session.addPlayer(new Player('Player 2', 2))
      session.addPlayer(new Player('Player 3', 3))

      server.updateUsername({ newUsername: 'Ariana', num: 2, sessionId: '12345' })
      
      let desiredPlayer = session.players.find(player => player.num === 2)
      expect(desiredPlayer).to.deep.equal({ username: 'Ariana', num: 2})
    })

    // TODO: Check correct room was used.
    it('should emit player-updated to the correct room with the new player info', function () {
      let toStub = sinon.stub()
      let emitSpy = sinon.spy()

      let testSession = '12345'

      server.io.to = toStub.returns({
        emit: emitSpy
      })

      let session = mockSessions[0]

      session.addPlayer(new Player('Player 2', 2))
      server.updateUsername({ newUsername: 'Ariana', num: 2, sessionId: '12345' })

      emitSpy.calledWith('player-updated', { username: 'Ariana', num: 2 }).should.be.true
    })
  })
})