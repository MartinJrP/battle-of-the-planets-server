export default interface Round {
  num: Number
  teamOnePlayerNum: Number,
  teamTwoPlayerNum: Number,

  completed?: Boolean,
  winningTeam?: Number
}