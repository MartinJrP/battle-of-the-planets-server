import Round from "./Round"
import Question from "./Question";

export default class RoundSession {

  // The current round
  round: Round

  // The question for the current round.
  question: Question

  // The first attempt made by any player.
  firstAttempt?: Number = undefined

  teamOneReady: Boolean = false

  teameTwoReady: Boolean = false

  // Linux epoch timestamp representing when the user tapped their answer button
  teamOneResponseTimestamp?: Number = undefined

  teamTwoResponseTimestamp?: Number = undefined

  constructor(round: Round, question: Question) {
    this.round = round
    this.question = question
  }

  public attemptToAnswer (team: number, answerIndex: number): boolean {
    if (this.round.completed) return

    if (this.question.answer == answerIndex) {
      this.round.winningTeam = team
      this.round.completed = true
      return true

    } else if (this.firstAttempt) {
        this.round.completed = true
    }
    return false
  }

  public bothPlayersReady () {
    return this.teamOneReady && this.teameTwoReady
  }

  public teamWhoShouldRespond (): number | null {
    if (!this.bothPlayersSubmittedTimestamps()) return null

    return this.teamOneResponseTimestamp > this.teamTwoResponseTimestamp ? 2 : 1
  }

  private bothPlayersSubmittedTimestamps () {
    return this.teamOneResponseTimestamp && this.teamTwoResponseTimestamp
  }

}