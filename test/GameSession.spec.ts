import 'chai/register-should'
import { assert, expect } from 'chai'

import GameSession from './../src/GameObjects/GameSession'
import Player from './../src/GameObjects/Player'
import * as Constants from './../src/Constants'
import { NOT_ENOUGH_PLAYERS } from '../src/Errors';

describe('GameSession', function () {

  var mockSessions: GameSession[] = []

  beforeEach(function () {
    mockSessions = [
      new GameSession('12345'),
      new GameSession('ABCDE')
    ]
  })

  describe('GenerateNewGameId', function () {
    it('should return a 5 digit alphanumeric code', function () {
      let code = GameSession.GenerateNewGameId(mockSessions)
      code.should.be.lengthOf(5)
    })
  })

  describe('addPlayer', function () {
    it('should push a new player instance to the players array', function () {
      let newPlayer = new Player('Johnny', 1)
      mockSessions[0].addPlayer(newPlayer)

      mockSessions[0].players.should.include(newPlayer)
    })
    it('should add throw an error if the max number of players allowed per game is reached', function () {
      for(let i = 0; i < Constants.MAX_PLAYER_COUNT; i++) {
        let newPlayer = new Player('Player ' + i, 1)
        mockSessions[0].addPlayer(newPlayer)
      }

      function addExtraPlayer () {
        let extraPlayer = new Player('Extra Player', 1)
        mockSessions[0].addPlayer(extraPlayer)
      }
      
      addExtraPlayer.should.throw('Max player count reached.')
    })
  })

  describe('generateTeams', function () {
    it('should generate the correct number of rounds for even number of players', function () {
      let session = mockSessions[0]
      
      for (let i = 0; i < 6; i++) {
        session.addPlayer(new Player('Player 1', i))
      }
      session.generateRounds()

      expect(session.rounds.length).to.be.equal(3)
    })
    it('should generate the correct number of rounds for odd number of players', function () {
      let session = mockSessions[0]
      
      for (let i = 0; i < 7; i++) {
        session.addPlayer(new Player('Player 1', i))
      }
      session.generateRounds()

      expect(session.rounds.length).to.be.equal(4)
    })
    it('should match up each player to another player', function () {
      let session = mockSessions[0]
      
      for (let i = 0; i < 6; i++) {
        session.addPlayer(new Player('Player 1', i))
      }
      session.generateRounds()

      session.rounds.forEach(round => {
        //console.log(round)
        expect(round.teamOnePlayerNum !== round.teamTwoPlayerNum).to.be.true
      })
    })
    it('should throw an error if less than two people are in the game', function () {
      let session = mockSessions[0]
      
      for (let i = 0; i === 1; i++) {
        session.addPlayer(new Player('Player 1', 1))
        console.log(session.players)
      }
      
      (function () {
        session.generateRounds()
      })
      .should.throw(NOT_ENOUGH_PLAYERS.code)
    })
    it('should not match up a single player more than twice')
    it('should match the last player with the first player if there are an odd number of players')
  })

})