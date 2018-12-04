import GameSession from './GameSession'
import Player from './Player';

export default class GameServer {

  io: SocketIO.Server
  sessions: GameSession[]

  constructor(io: SocketIO.Server) {
    this.io = io
    this.sessions = []

    //console.log('Game Server Initialized')
  }

  public createSession(socket: SocketIO.Socket, acknowledgement: (...args: any[]) => void) {
    // TODO: Consider how vital it is to check for session with existing Id
    let newId = GameSession.GenerateNewGameId(this.sessions)
    let session = new GameSession(newId)
  
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

}