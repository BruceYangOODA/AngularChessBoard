

gameData = [];
//boardStart : Array<Array<Array<string>>>;
const boardStart = [
    [['18','15'],['28','14'],['38','13'],['48','12'],['58','11'],['68','13'],['78','14'],['88','15']],
    [['17','16'],['27','16'],['37','16'],['47','16'],['57','16'],['67','16'],['77','16'],['87','16']],
    [['16','00'],['26','00'],['36','00'],['46','00'],['56','00'],['66','00'],['76','00'],['86','00']],
    [['15','00'],['25','00'],['35','00'],['45','00'],['55','00'],['65','00'],['75','00'],['85','00']],
    [['14','00'],['24','00'],['34','00'],['44','00'],['54','00'],['64','00'],['74','00'],['84','00']],
    [['13','00'],['23','00'],['33','00'],['43','00'],['53','00'],['63','00'],['73','00'],['83','00']],
    [['12','26'],['22','26'],['32','26'],['42','26'],['52','26'],['62','26'],['72','26'],['82','26']],
    [['11','25'],['21','24'],['31','23'],['41','22'],['51','21'],['61','23'],['71','24'],['81','25']],
  ];

registRoom = function(data) {
    let boardData = [];
    for(var i=0; i<boardStart.length; i++){
        boardData.push(boardStart[i]);        
    }

    gameStatus = {
        player: [data.player],
        room: data.room,
        active: "",
        board: boardData,
        gameStart: false,
    };
    gameData.push(gameStatus);
}
joinGame = function(playerData) {
    let room = playerData.room;
    let player = playerData.player;
    let roomData = getPlayerInRoom(room);
    let oppnent = roomData.player[0];
    let blackOrWhite = oppnent[2]=='1'?'2':'1';
    player.push(blackOrWhite)
    roomData.player.push(player);
    roomData.gameStart = true;
    roomData.active = oppnent[2]=="1"? oppnent[0] : player[0];    

    let result = {
        isGameReady: true,
        playerToNotify: oppnent[0],
        player: player
    }

    return result;
}
getRoomData = function(room) {
    let roomData = gameData.find(ele => ele.room == room);
    return roomData;
}
getPlayerInRoom = function(room) {
    return gameData.find(ele => ele.room == room);
}
getRooms = function() {
    let rooms = [];
    for (var i =0; i<gameData.length; i++){
        let roomData = {
            room : gameData[i].room,
            gameStart : gameData[i].gameStart,
        }
        rooms.push(roomData)
    }
    return rooms;
}
updateBoard = function(update) {
    let room = update.room;    
    let chessMan = update.chessMan;
    let startPos = update.startPos;
    let endPos = update.endPos;
    alterBoardStatus(room, '00', startPos);
    alterBoardStatus(room, chessMan, endPos);
}

alterBoardStatus = function(room, chessMan, boardPos) {
    let game = gameData.find(ele => ele.room = room);
    let board = game.board;
    if (board) {
        for (var i=0; i<board.length; i++) {
            for (var j=0; j<board[i].length; j++){
              if(board[i][j][0] == boardPos) {
                  board[i][j][1]=chessMan;
                }
            }
          }
    }
}

module.exports = {
    registRoom: registRoom,
    getRoomData: getRoomData,
    getRooms: getRooms,
    joinGame: joinGame,
    updateBoard: updateBoard,
}