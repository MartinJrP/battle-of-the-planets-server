"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameSession_1 = __importDefault(require("./GameSession"));
const Player_1 = __importDefault(require("./Player"));
class GameServer {
    constructor(io) {
        this.io = io;
        this.sessions = [];
        // console.log('Game Server Initialized')
    }
    createSession(socket, acknowledgement) {
        // TODO: Consider how vital it is to check for session with existing Id
        let newId = GameSession_1.default.GenerateNewGameId(this.sessions);
        let session = new GameSession_1.default(newId);
        this.sessions.push(session);
        socket.join(newId);
        acknowledgement(newId);
    }
    joinSession(sessionId, socket, acknowledgement) {
        let session = this.sessions.find((session) => session.id === sessionId);
        if (session) {
            let playerNum = session.players.length + 1;
            let playerName = 'Player ' + playerNum;
            let player = new Player_1.default(playerName, playerNum);
            try {
                session.addPlayer(player);
                socket.join(sessionId);
                this.io.to(sessionId).emit('player-added', player);
                acknowledgement(player);
                return;
            }
            catch (err) {
                acknowledgement({ error: err.message });
                return;
            }
        }
        else {
            acknowledgement({ error: 'Session Not Found' });
            return;
        }
    }
    updateUsername(data) {
        // This brings into question how players are stored.
        // A seperate store fosr players might help. Easier sorting. Less opporttunity for misuse (such as editing any player from any session once given the sessionId)
        console.log(data);
        console.log(this.sessions);
        // let player = this.playerWith(data.num, data.sessionId)
        let session = this.sessions.find(session => session.id === data.sessionId);
        let player = session.players.find(player => player.num === data.num);
        if (!player)
            return;
        player.username = data.newUsername;
        this.io.to(data.sessionId).emit('player-updated', player);
    }
    // Helper Methods
    sessionWith(id) {
        return this.sessions.find(session => session.id === id);
    }
    playerWith(num, sessionId) {
        let session = this.sessionWith(sessionId);
        if (!session)
            return;
        return session.players.find(player => player.num === num);
    }
}
exports.default = GameServer;
//# sourceMappingURL=GameServer.js.map