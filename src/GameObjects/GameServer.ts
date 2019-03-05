import GameSession from './GameSession'
import Player from './Player';
import Round from './Round';
import RoundSession from './RoundSession';

export default class GameServer {

  io: SocketIO.Server
  sessions: GameSession[]

  constructor(io: SocketIO.Server) {
    this.io = io
    this.sessions = []

    // console.log('Game Server Initialized')
  }

  public createSession(socket: SocketIO.Socket, acknowledgement: (...args: any[]) => void) {
    // TODO: Consider how vital it is to check for session with existing Id
    let newId = GameSession.GenerateNewGameId(this.sessions)
    let session = new GameSession(newId)
    session.displaySocketId = socket.id

    this.sessions.push(session)
    socket.join(newId)
    acknowledgement(newId)
  }

  public joinSession(sessionId: string, socket: SocketIO.Socket, acknowledgement: (...args: any[]) => void) {
    
    let session = this.sessions.find((session) => session.id === sessionId)

    if (session) {
      let playerNum = session.players.length + 1
      let playerName = 'Player ' + playerNum
      let player = new Player(playerName, playerNum)

      try {
        session.addPlayer(player)
        session.playerSockets.push({
          id: socket.id,
          num: player.num
        })

        socket.join(sessionId)
        this.io.to(sessionId).emit('player-added', player)
        acknowledgement(player)
        return
      } catch (err) {
        acknowledgement({ error: err.message })
        return
      }
      
    }
    else {
      acknowledgement({ error: 'Session Not Found' })
      return
    }
  }

  public updateUsername(data: { newUsername: string, num: number, sessionId: string }) {
    // This brings into question how players are stored.
    // A seperate store fosr players might help. Easier sorting. Less opporttunity for misuse (such as editing any player from any session once given the sessionId)

    // let player = this.playerWith(data.num, data.sessionId)
    let session = this.sessions.find(session => session.id === data.sessionId)
    let player = session.players.find(player => player.num === data.num)
    if (!player) return

    player.username = data.newUsername

    this.io.to(data.sessionId).emit('player-updated', player)
  }

  public generateTeams(sessionId: string, acknowledgement: (...args: any[]) => void) {
    let session = this.sessions.find(session => session.id === sessionId)
    let self = this

    try { 
      session.generateRounds()
      console.log(session)
      acknowledgement(session.rounds) 
      
      session.rounds.forEach(round => {
        let playerOneSocket = session.playerSockets.find(socket => socket.num === round.teamOnePlayerNum)
        let playerTwoSocket = session.playerSockets.find(socket => socket.num === round.teamTwoPlayerNum)

        self.io
          .to(playerOneSocket.id)
          .to(playerTwoSocket.id)
          .emit('teams-generated', { round: round, players: session.players })
      })
    } catch (e) {
      console.error(e)
      acknowledgement(e)
    }

  }

  /// Prepares the next session to begin the round. Asks users if they are read to begin.
  public prepareNextRound(sessionId: string, acknowledgement: (...args: any[]) => void) {
    let session = this.sessions.find(session => session.id === sessionId)
    session.setupNextRound()

    let round = session.currentRoundSession.round

    let playerOneSocket = session.playerSockets.find(socket => socket.num === round.teamOnePlayerNum)
    let playerTwoSocket = session.playerSockets.find(socket => socket.num === round.teamTwoPlayerNum)

    this.io
      .to(playerOneSocket.id)
      .to(playerTwoSocket.id)
      .emit('prepare-to-play')

    acknowledgement(session.currentRoundSession.round.num)
  }

  /// Declares that the player for a current round is ready to begin.
  public setPlayerIsReady(data: { sessionId: string, playerNum: number}) {
    let session = this.sessions.find(session => session.id === data.sessionId)
    let roundSession = session.currentRoundSession
    let round = roundSession.round

    let teamOnePlayerNum = round.teamOnePlayerNum
    let teamTwoPlayerNum = round.teamTwoPlayerNum

    if (data.playerNum === teamOnePlayerNum) {
      roundSession.teamOneReady = true
    } 
    else if (data.playerNum === teamTwoPlayerNum) {
      roundSession.teameTwoReady = true
    } 
    else { return }

    this.io.to(session.displaySocketId).emit('player-ready', data.playerNum)

    if (roundSession.bothPlayersReady()) {
      let playerOneSocket = session.playerSockets.find(socket => socket.num === round.teamOnePlayerNum)
      let playerTwoSocket = session.playerSockets.find(socket => socket.num === round.teamTwoPlayerNum)

      this.io
        .to(playerOneSocket.id)
        .to(playerTwoSocket.id)
        .to(session.displaySocketId)
        .emit('begin-round')
    }
  }

  public dispenseQuestion(sessionId: string, acknowledgement: (...args: any[]) => void) {
    let session = this.sessions.find(session => session.id === sessionId)
    let roundSession = session.currentRoundSession
    let round = roundSession.round

    let question = session.questions.find((question, index) => index === round.questionIndex)
    
    acknowledgement(question)
  }

  public beginAcceptingResponses(sessionId: string) {
    let session = this.sessions.find(session => session.id === sessionId)
    let roundSession = session.currentRoundSession
    let round = roundSession.round

    let playerOneSocket = session.playerSockets.find(socket => socket.num === round.teamOnePlayerNum)
    let playerTwoSocket = session.playerSockets.find(socket => socket.num === round.teamTwoPlayerNum)

    this.io
      .to(playerOneSocket.id)
      .to(playerTwoSocket.id)
      .emit('allow-answers')
  }

  // Should be called by a client when the attempt to answer a question. The server evaluates who clicked first, and grants access to the first click.
  public requestToAnswerQuestion(data: { sessionId: string, playerNum: number, timestamp: number}) {
    
    let session = this.sessions.find(session => session.id === data.sessionId)
    let roundSession = session.currentRoundSession
    let round = roundSession.round

    // Save timestamp to server.
    let responseIsFromTeamOne = data.playerNum === round.teamOnePlayerNum
    console.log(`[Game ${session.id}]: Request to respond from team ${responseIsFromTeamOne ? 1 : 2}`)

    if (responseIsFromTeamOne) roundSession.teamOneResponseTimestamp = data.timestamp
    else if (!responseIsFromTeamOne) roundSession.teamTwoResponseTimestamp = data.timestamp
    else return

    // If both users tap, invalidate the timeout and evaluate who should respond first.
    let teamToRespond = roundSession.teamWhoShouldRespond()
    if (!teamToRespond) {
      console.log(`[Game ${session.id}]: Both teams yet to respond. Setting Timeout.`)
      session.responseWaiter = setTimeout( () => {
        this.notifyClientsOfResponder(data.sessionId)
      }, 2000)
    } else {
      console.log(`[Game ${session.id}]: Team ${ teamToRespond } should respond`)
      this.notifyClientsOfResponder(data.sessionId, teamToRespond)
    }
  }

  private notifyClientsOfResponder (sessionId: string, responder?: number) {
    let session = this.sessions.find(session => session.id === sessionId)
    let roundSession = session.currentRoundSession
    let round = roundSession.round

    clearTimeout(session.responseWaiter)
    session.responseWaiter = undefined
    
    let playerOneSocket = session.playerSockets.find(socket => socket.num === round.teamOnePlayerNum)
    let playerTwoSocket = session.playerSockets.find(socket => socket.num === round.teamTwoPlayerNum)

    let teamToRespond
    if (!responder) {
      teamToRespond = roundSession.teamOneResponseTimestamp ? 1 : 2
      console.log(`[Game ${session.id}]: Setting from timeout. Team ${ teamToRespond } plays`)
    } else {
      teamToRespond = responder
      console.log(`[Game ${session.id}]: Evaluating both players. Team ${ teamToRespond } plays`)
    }

    this.io
      .to(playerOneSocket.id)
      .to(playerTwoSocket.id)
      .to(session.displaySocketId)
      .emit('player-can-respond', teamToRespond)
  }
}