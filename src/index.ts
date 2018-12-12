import express from 'express'
import http from 'http'
import socket from 'socket.io'

var app = express()
var server = new http.Server(app)
var io = socket(server);

import GameServer from './GameObjects/GameServer';
const gameServer = new GameServer(io)

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
  socket.on('update-username', data => gameServer.updateUsername(data))
  socket.on('generate-teams', (sessionId, acknowledgement) => gameServer.generateTeams(sessionId, acknowledgement))

  // Gameplay API
  socket.on('prepare-next-round', (sessionId, acknowledgement) => gameServer.prepareNextRound(sessionId, acknowledgement))
  socket.on('player-ready', data => gameServer.setPlayerIsReady(data))
  socket.on('dispense-question', (sessionId, acknowledgement) => gameServer.dispenseQuestion(sessionId, acknowledgement))
  socket.on('begin-accepting-responses', sessionId => gameServer.beginAcceptingResponses(sessionId))
}