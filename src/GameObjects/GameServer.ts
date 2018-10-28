import GameSession from './GameSession'

export default class GameServer {

  sessions: GameSession[]

  constructor() {
    this.sessions = []

    console.log('Game Server Initialized')
  }

  public createSession(socket: SocketIO.Socket, acknowledgement: (...args: any[]) => void) {
    // TODO: Consider how vital it is to check for session with existing Id
    let newId = GameSession.GenerateNewGameId(this.sessions)
    let session = new GameSession(newId)
  
    this.sessions.push(session)
    acknowledgement(newId)
  }

}