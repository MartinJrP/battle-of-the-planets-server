var CodeGenerator = require('node-code-generator')

import Player from './Player'
import * as Constants from './../Constants'
import * as ERROR_NAME from './../Errors'
import Round from './Round';

/// Manages and individual GameSession instance.
export default class GameSession {

  // The unique session id
  id: string

  // The players in enrolled in the game session
  players: Player[]

  // 
  rounds: Round[]

  constructor (id: string) {
    this.id = id
    this.players = []
    this.rounds = []
  }


  public addPlayer(player: Player) {
    if (this.players.length >= Constants.MAX_PLAYER_COUNT) {
      let error = new Error('Max player count reached.')
      error.name = ERROR_NAME.MAX_PLAYERS_REACHED
      throw Error('Max player count reached.')
    } else {
      this.players.push(player)
    }
  }

  public generateRounds() {
    // TODO: This method should be tested more thoroughly
    if (this.players.length < 2) throw ERROR_NAME.NOT_ENOUGH_PLAYERS.code

    let shuffledPlayers = this.shuffle(this.players)

    let rounds = shuffledPlayers.filter((player, index) => {
      if (index % 2 === 0) return

      let previousPlayer = shuffledPlayers[index - 1]
      let round = {
        playerOne: player.num,
        playerTwo: previousPlayer.num
      }

      this.rounds.push(round)
    })

    if (this.players.length % 2 !== 0) {
      // Match up last player with first
      let bonusRound = {
        playerOne: shuffledPlayers[shuffledPlayers.length - 1].num,
        playerTwo: shuffledPlayers[0].num
      }
      this.rounds.push(bonusRound)
    }
  }

  public static GenerateNewGameId(currentSessions: GameSession[]): string {
    let generator = new CodeGenerator()
    let pattern = '#####'
    let existingCodes = currentSessions.map(session => session.id)
    let options = {
      existingCodesLoader: (pattern: string) => [existingCodes]
    }

    let codes = generator.generateCodes(pattern, 1, options) as string[]
    return codes[0]
  }

  // Helpers
  private shuffle(array: Array<Player>) {
    // https://stackoverflow.com/a/2450976/1940440
    var currentIndex = array.length
    var temporaryValue
    var randomIndex
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array
  }
}

 