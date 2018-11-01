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
        //console.log('Game Server Initialized')
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
            let playerName = 'Player ' + (session.players.length + 1);
            let player = new Player_1.default(playerName);
            session.addPlayer(player);
            socket.join(sessionId);
            acknowledgement({ username: playerName });
            this.io.to(sessionId).emit('player-added', playerName);
            return;
        }
        else {
            acknowledgement({ error: 'Session Not Found' });
            return;
        }
    }
}
exports.default = GameServer;
//# sourceMappingURL=GameServer.js.map