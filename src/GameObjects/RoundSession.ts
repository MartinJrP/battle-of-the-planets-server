import Round from "./Round";

export default class RoundSession {

  round: Round

  teamOneReady: Boolean = false

  teameTwoReady: Boolean = false

  constructor(round: Round) {
    this.round = round
  }

  bothPlayersReady () {
    return this.teamOneReady && this.teameTwoReady
  }

  

}