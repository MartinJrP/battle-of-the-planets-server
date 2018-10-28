import 'chai/register-should'

import GameSession from './../src/GameObjects/GameSession'
import Player from './../src/GameObjects/Player'
import * as Constants from './../src/Constants'

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
      let newPlayer = new Player('Johnny')
      mockSessions[0].addPlayer(newPlayer)

      mockSessions[0].players.should.include(newPlayer)
    })
    it('should add throw an error if the max number of players allowed per game is reached', function () {
      for(let i = 0; i < Constants.MAX_PLAYER_COUNT; i++) {
        let newPlayer = new Player('Player ' + i)
        mockSessions[0].addPlayer(newPlayer)
      }

      function addExtraPlayer () {
        let extraPlayer = new Player('Extra Player')
        mockSessions[0].addPlayer(extraPlayer)
      }
      
      addExtraPlayer.should.throw('Max player count reached.')
    })
  })

})