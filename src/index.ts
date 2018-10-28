import express from 'express'
import http from 'http'
import socket from 'socket.io'

var app = express()
var server = new http.Server(app)
var io = socket(http);

import GameServer from './GameObjects/GameServer';
const gameServer = new GameServer()

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', attatchSocketListeners);

server.listen(3000, function(){
  console.log('Listening on *:3000');
});



function attatchSocketListeners(socket: socket.Socket) {
  console.log('User Connected');

  socket.on('create-session', gameServer.createSession)
}