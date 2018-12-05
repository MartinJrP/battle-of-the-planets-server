"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const cors_1 = __importDefault(require("cors"));
var app = express_1.default();
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
const GameServer_1 = __importDefault(require("./GameObjects/GameServer"));
const gameServer = new GameServer_1.default(io);
app.use(express_1.default.static('public'));
app.use(cors_1.default({
    origin: false
}));
io.on('connection', attatchSocketListeners);
let port = process.env.PORT;
if (port == null || port == "") {
    port = 8000;
}
server.listen(port, function () {
    console.log('App listening on *:' + port);
    console.log(`Socket Server listening on: ${io.path()}`);
});
function attatchSocketListeners(socket) {
    console.log('User Connected');
    socket.on('create-session', (data, acknowledgement) => gameServer.createSession(socket, acknowledgement));
    socket.on('join-session', (sessionId, acknowledgement) => gameServer.joinSession(sessionId, socket, acknowledgement));
    socket.on('update-username', gameServer.updateUsername);
}
//# sourceMappingURL=index.js.map