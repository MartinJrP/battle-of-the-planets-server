export default interface Round {
  num: Number
  teamOnePlayerNum: Number,
  teamTwoPlayerNum: Number,

  questionIndex: Number
  completed?: Boolean,
  winningTeam?: Number
}