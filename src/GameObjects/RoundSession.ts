import Round from "./Round"

export default class RoundSession {

  round: Round

  teamOneReady: Boolean = false

  teameTwoReady: Boolean = false

  // Linux epoch timestamp representing when the user tapped their answer button
  teamOneResponseTimestamp?: Number = undefined

  teamTwoResponseTimestamp?: Number = undefined

  constructor(round: Round) {
    this.round = round
  }

  public bothPlayersReady () {
    return this.teamOneReady && this.teameTwoReady
  }

  // TODO: Test this.
  public teamWhoShouldRespond (): number | undefined {
    if (!this.bothPlayersSubmittedTimestamps()) return

    return this.teamOneResponseTimestamp > this.teamTwoResponseTimestamp ? 1 : 2
  }

  private bothPlayersSubmittedTimestamps () {
    return this.teamOneResponseTimestamp && this.teamTwoResponseTimestamp
  }

}