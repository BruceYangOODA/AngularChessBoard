const { throws } = require('assert');
let express = require('express');
let app = express();

let http = require('http');
let server = http.createServer(app);

let socketIO = require('socket.io');
let io = socketIO(server);

let model = require('./model.js');

const SERVER_PORT = process.env.PORT || 3000;

server.listen(SERVER_PORT, () => {
    console.log("SERVER SERVE ON ",SERVER_PORT);    
});

io.on("connection", (socket) => {

    socket.on("require socket id", () =>{
        io.to(socket.id).emit("your id", socket.id);        
    });

    socket.on("require game status", (room) => {
        let roomData = model.getRoomData(room);
        if (roomData) {
            io.to(socket.id).emit("recive game status", roomData);
            socket.join(room);
        }
        else { io.to(socket.id).emit("recive game status", null); }

    });

    socket.on("require rooms data", () => {
        let rooms = model.getRooms();
        io.to(socket.id).emit("recive rooms data", rooms);
    });
    
    socket.on("create room", (gameStatus) => {        
        model.registRoom(gameStatus);
        socket.join(gameStatus.room);
        let isGameLoaded = true;
        io.to(socket.id).emit("game ready", (isGameLoaded));        
    });

    socket.on("join game", (playerData) => {
        console.log("playerData",playerData);
        let result = model.joinGame(playerData);     
        console.log("RESULT",result);   
        if(result.isGameReady) io.to(socket.id).emit("game start", result.isGameReady);
        io.to(result.playerToNotify).emit("palyer joined",result.player);
    });

    socket.on('update board', (update) =>{
        let room = update.room;
        model.updateBoard(update);
        socket.broadcast.to(room).emit('update board', update);
        
    });
});




