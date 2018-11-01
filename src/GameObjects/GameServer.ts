import GameSession from './GameSession'
import Player from './Player';

export default class GameServer {

  sessions: GameSession[]

  constructor() {
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
      let playerName = 'Player ' + (session.players.length + 1)
      let player = new Player(playerName)

      session.addPlayer(player)

      socket.join(sessionId)
      acknowledgement({ username: playerName })
      return
    }
    else {
      acknowledgement({ error: 'Session Not Found' })
      return
    }
  }

}