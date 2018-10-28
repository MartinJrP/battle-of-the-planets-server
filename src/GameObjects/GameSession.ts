var CodeGenerator = require('node-code-generator')

import Player from './Player'
import * as Constants from './../Constants'
import * as ERROR_NAME from './../Errors'

/// Manages and individual GameSession instance.
export default class GameSession {

  // The unique session id
  id: string

  // The players in enrolled in the game session
  players: Player[]

  constructor (id: string) {
    this.id = id
    this.players = []
  }


  addPlayer(player: Player) {
    if (this.players.length >= Constants.MAX_PLAYER_COUNT) {
      let error = new Error('Max player count reached.')
      error.name = ERROR_NAME.MAX_PLAYERS_REACHED
      throw Error('Max player count reached.')
    } else {
      this.players.push(player)
    }
  }

  static GenerateNewGameId(currentSessions: GameSession[]): string {
    let generator = new CodeGenerator()
    let pattern = '#####'
    let existingCodes = currentSessions.map(session => session.id)
    let options = {
      existingCodesLoader: (pattern: string) => [existingCodes]
    }

    let codes = generator.generateCodes(pattern, 1, options) as string[]
    return codes[0]
  }
}

 