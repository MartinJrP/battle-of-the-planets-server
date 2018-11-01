import express from 'express'
import http from 'http'
import socket from 'socket.io'
import cors from 'cors'

var app = express()
var server = new http.Server(app)
var io = socket(server);

import GameServer from './GameObjects/GameServer';
const gameServer = new GameServer(io)

app.use(express.static('public'))
app.use(cors({
  origin: false
}))

io.on('connection', attatchSocketListeners);

let port: number | string = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
server.listen(port, function(){
  console.log('App listening on *:' + port);
  console.log(`Socket Server listening on: ${ io.path() }`)
});



function attatchSocketListeners(socket: socket.Socket) {
  console.log('User Connected');

  socket.on('create-session', (data, acknowledgement) => gameServer.createSession(socket, acknowledgement))
  socket.on('join-session', (sessionId, acknowledgement) => gameServer.joinSession(sessionId, socket, acknowledgement))
}