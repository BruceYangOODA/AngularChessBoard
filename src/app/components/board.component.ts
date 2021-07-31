import { Component, OnInit } from '@angular/core';
import { ChessService } from '../chess.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  /*board = [
        [['18','15'],['28','14'],['38','13'],['48','12'],['58','11'],['68','13'],['78','14'],['88','15']],
        [['17','16'],['27','16'],['37','16'],['47','16'],['57','16'],['67','16'],['77','16'],['87','16']],
        [['16','00'],['26','00'],['36','00'],['46','00'],['56','00'],['66','00'],['76','00'],['86','00']],
        [['15','00'],['25','00'],['35','00'],['45','00'],['55','00'],['65','00'],['75','00'],['85','00']],
        [['14','00'],['24','00'],['34','00'],['44','00'],['54','00'],['64','00'],['74','00'],['84','00']],
        [['13','00'],['23','00'],['33','00'],['43','00'],['53','00'],['63','00'],['73','00'],['83','00']],
        [['12','26'],['22','26'],['32','26'],['42','26'],['52','26'],['62','26'],['72','26'],['82','26']],
        [['11','25'],['21','24'],['31','23'],['41','22'],['51','21'],['61','23'],['71','24'],['81','25']],
      ];
    */
  board :Array<Array<Array<string>>> = [];
  boardColor = [ 
            ['18','1'], ['28','2'],['38','1'], ['48','2'],['58','1'], ['68','2'],['78','1'], ['88','2'],
            ['17','2'], ['27','1'],['37','2'], ['47','1'],['57','2'], ['67','1'],['77','2'], ['87','1'],
            ['16','1'], ['26','2'],['36','1'], ['46','2'],['56','1'], ['66','2'],['76','1'], ['86','2'],
            ['15','2'], ['25','1'],['35','2'], ['45','1'],['55','2'], ['65','1'],['75','2'], ['85','1'],
            ['14','1'], ['24','2'],['34','1'], ['44','2'],['54','1'], ['64','2'],['74','1'], ['84','2'],
            ['13','2'], ['23','1'],['33','2'], ['43','1'],['53','2'], ['63','1'],['73','2'], ['83','1'],
            ['12','1'], ['22','2'],['32','1'], ['42','2'],['52','1'], ['62','2'],['72','1'], ['82','2'],
            ['11','2'], ['21','1'],['31','2'], ['41','1'],['51','2'], ['61','1'],['71','2'], ['81','1']
          ]  
  
  startPos: string = "";
  endPos: string = "";
  userID: string="";
  room: string = "";
  activePlayer:string ="";
  isGameStart: boolean = false;
  players: Array<Array<string>> = [];
  player: Array<string> = [];
  opponent: Array<string> = [];
  whoPlay: string= "";
  isPlayer: boolean= false;
  isMoved: boolean = true;

  constructor(private chessService: ChessService,
              private _route: ActivatedRoute,
              private _router:Router) { 

    let roomName = this._route.snapshot.paramMap.get('room');
    if(roomName) this.room =roomName;      
    this.chessService.reciveUserID().subscribe((socektID) => {
      this.userID = socektID;
    });

    this.chessService.reciveRoomStatus(this.room).subscribe((gameData) => {
      if (gameData == null) this._router.navigate(["home"]);
      this.board = gameData.board;
      this.activePlayer = gameData.active;
      this.isGameStart = gameData.gameStart;
      this.players = gameData.player;
      let findPlayer = this.players.find(ele => ele[0] == this.userID);      
      if(findPlayer) {
        this.isPlayer = true;
        console.log("this.player.length",this.players.length);
        if(this.players.length==1) {  
          this.whoPlay = "等待對手  ";
          this.player = this.players[0];
          this.chessService.waitPlayer().subscribe((opponent) => {
            if(opponent) { 
              this.players.push(opponent);
              this.opponent = opponent;
              let _activePlayer = this.players.find(ele => ele[2]=="1");
              if (_activePlayer) { 
                this.activePlayer = _activePlayer[0];
                let playerName = _activePlayer[1];
                let blackOrWhite = _activePlayer[2]=='1'?'黑子':'白子'
                this.whoPlay = playerName + ' ' + blackOrWhite;
                //if(this.userID == this.activePlayer) this.isMoved = false;
              }
            }
          });
        }
        else {
          let thePlayer = this.players.find(ele => ele[0] == this.userID);
          if (thePlayer) { 
            this.player = thePlayer;
            this.opponent = this.players[0][0] == this.userID? this.players[1] : this.players[0];
          }

          let _activePlayer = this.players.find(ele => ele[0] == this.activePlayer);          
          if(_activePlayer) {            
            let player = _activePlayer[1];            
            let blackOrWhite = _activePlayer[2]=='1'?'黑子':'白子'            
            this.whoPlay = player + " " + blackOrWhite;
            //if (this.userID == this.activePlayer) this.isMoved = false; 
          }
        }
      }
      else this.whoPlay = "觀戰中";
    });  
    
    this.chessService.reciveUpdateBoard().subscribe((update) => {
      let data = JSON.parse(JSON.stringify(update))
      if(data) {
        let chessMan = data.chessMan;
        let startPos = data.startPos;
        let endPos = data.endPos;
        this.alterBoardStatus('00',startPos);
        this.alterBoardStatus(chessMan, endPos);
        if(this.isPlayer) {
          this.activePlayer = this.player[0];
          this.isMoved = false;
          let playerName = this.player[1];
          let balckOrWhite = this.player[2]=='1'?'黑子':'白子'
          this.whoPlay = playerName + ' ' +  balckOrWhite;
        }
      }
    });
  }

  ngOnInit(): void {
  }

  getChessManImg(pos:any) :string{   
    var boardColor = this.getBoardColor(pos[0]);
    //var chessManColor = pos[1]==0? "00": ""+pos[1]    
    return boardColor + pos[1];
  }

  getBoardColor(boardPos:string): string{
    for (var i=0; i<this.boardColor.length;i++){
      if (this.boardColor[i][0] == boardPos) return this.boardColor[i][1]
    }
    return 'NotFoun';    
  }
  getChessManByPos(boardPos:string) :string {
    if (this.board.length ==0) return 'NotFoun';
    for (var i=0; i<this.board.length; i++) {
      for (var j=0; j<this.board[i].length; j++){
        if( this.board[i][j][0] == boardPos) return this.board[i][j][1]
      }
    }
    return 'NotFoun';
  }
  clickChessMan(event:any) :void{
    if(!this.isPlayer) return;    
    if(this.activePlayer != this.userID) return;
    if (this.startPos == "") {
      this.startPos = event.alt;
      let chessManTag = this.getChessManByPos(this.startPos).substr(0,1);
      if(chessManTag != this.player[2]) {
        this.startPos = '';
        return;
      }

    }
    else if (this.endPos =="") {
      this.endPos = event.alt;

      var chessMan = this.getChessManByPos(this.startPos);
      var validMove = this.validMove(chessMan,this.startPos,this.endPos);
      if(validMove) {
        this.moveChessMan(chessMan,this.startPos,this.endPos);
      }
      else {
        this.startPos = "";
        this.endPos = "";
      }
    }
    else { 
      this.startPos = "";
      this.endPos = "";
    }    
  }
  validMoveAsBishop(startX:number,startY:number,endX:number,endY:number) :boolean{
    var moveLengthX = Math.abs(startX - endX);
        var moveLengthY = Math.abs(startY - endY);
        if (moveLengthX != moveLengthY) return false;
        if (moveLengthX == 1) return true;
        //左上
        if(startX-endX>0 && startY-endY<0){
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX-i) + (startY+i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //右上
        else if(startX-endX<0 && startY-endY<0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX+i) + (startY+i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //左下
        else if(startX-endX>0 && startY-endY>0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX-i) + (startY-i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //右下
        else if(startX-endX<0 && startY-endY>0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX+i) + (startY-i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
      return true;  
  }
  validMoveAsRook(startX:number, startY:number, endX:number, endY:number) :boolean{
    if (Math.abs(startX-endX) == 0) {
      var moveLength = Math.abs(startY-endY);
      if (moveLength == 1) return true;

      var baseY = Math.min(startY,endY);
      for (var i=1; i<moveLength;i++) {
        var pathPos = ""+startX+ (baseY+i);
        var pathChessMan = this.getChessManByPos(pathPos);              
        if (pathChessMan.substr(0,1) != '0') return false;
      }          
      return true;
    }
    else if (Math.abs(startY-endY) == 0) {
      var moveLength = Math.abs(startX-endX);
      if (moveLength == 1) return true;

      var baseX = Math.min(startX,endX);
      for (var i=1; i<moveLength;i++) {
        var pathPos = ""+ (baseX+i)+ startY;
        var pathChessMan = this.getChessManByPos(pathPos);              
        if (pathChessMan.substr(0,1) != '0') return false;
      }          
      return true;
    }
    return false;
  }
  validMove(chessMan:string, startPos:string, endPos:string) :boolean{
    if (chessMan=="00") return false;
    if (startPos == endPos) return false;    
    var startX = parseInt(startPos.substr(0,1));
    var startY = parseInt(startPos.substr(-1));
    var endX = parseInt(endPos.substr(0,1));
    var endY = parseInt(endPos.substr(-1));    
    var endChessMan = this.getChessManByPos(endPos);
    var endChessManSide = endChessMan.substr(0,1);
    var endChessManTag = endChessMan.substr(-1);
    var chessManSide = chessMan.substr(0,1);
    var chessManTag = chessMan.substr(-1);
    if(chessManSide == endChessManSide) return false;
    console.log(startPos,endPos,startX,startY,endX,endY);
    switch(chessManTag) {
      //King
      case "1":                
        if(Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1) return true;        
        break;
      //Queen  
      case "2":
        if(Math.abs(startX-endX)<=1 && Math.abs(startY-endY)<=1) return true;   
        //rookPath
        if (startX == endX || startY == endY){
          return this.validMoveAsRook(startX,startY,endX,endY);
        }
        //bishopPath
        else if(Math.abs(startX-endX) == Math.abs(startY-endY)){
          return this.validMoveAsBishop(startX,startY,endX,endY);
        }
        else { console.log("Queen Err");}
        break;   
      //Bishop     
      case "3":
        var moveLengthX = Math.abs(startX - endX);
        var moveLengthY = Math.abs(startY - endY);
        if (moveLengthX != moveLengthY) return false;
        if (moveLengthX == 1) return true;
        //左上
        if(startX-endX>0 && startY-endY<0){
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX-i) + (startY+i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //右上
        else if(startX-endX<0 && startY-endY<0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX+i) + (startY+i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //左下
        else if(startX-endX>0 && startY-endY>0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX-i) + (startY-i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        //右下
        else if(startX-endX<0 && startY-endY>0) {
          for(var i=1;i<moveLengthX; i++){
            var pathChessPos = "" + (startX+i) + (startY-i);
            var pathChessMan = this.getChessManByPos(pathChessPos);
            if (pathChessMan.substr(0,1) != '0') return false;
          }
        }
        else { console.log("Bishop Err");}        
        return true;
        break;   
      //Knight     
      case "4":
        if (startX == endX) return false;
        if (startY == endY) return false;
        var moveLength = Math.abs(startX - endX) + Math.abs(startY -endY);
        if (moveLength == 3) return true;
        break; 
      //Rook         
      case "5":
        if (Math.abs(startX-endX) == 0) {
          var moveLength = Math.abs(startY-endY);
          if (moveLength == 1) return true;

          var baseY = Math.min(startY,endY);
          for (var i=1; i<moveLength;i++) {
            var pathPos = ""+startX+ (baseY+i);
            var pathChessMan = this.getChessManByPos(pathPos);              
            if (pathChessMan.substr(0,1) != '0') return false;
          }          
          return true;
        }
        else if (Math.abs(startY-endY) == 0) {
          var moveLength = Math.abs(startX-endX);
          if (moveLength == 1) return true;

          var baseX = Math.min(startX,endX);
          for (var i=1; i<moveLength;i++) {
            var pathPos = ""+ (baseX+i)+ startY;
            var pathChessMan = this.getChessManByPos(pathPos);              
            if (pathChessMan.substr(0,1) != '0') return false;
          }          
          return true;
        }
        else { console.log("Rook Err")}
        break;        
      //Pawn  
      case "6":
        if(endChessManSide != '0') {          
            if(startX == endX) return false;
            if(chessManSide == "1") {
              if(Math.abs(startX-endX) != 1) return false;
              if(startY - endY == 1) return true;
            }
            else {
              if(Math.abs(startX-endX) != 1) return false;
              if(endY - startY == 1) return true;
            }
        } 
        else if (endChessManSide == '0') {
          if(startX != endX) return false;
          if(chessManSide == "1") {
            if(startY == 7) {
              if(startY - endY == 1) return true;
              if(startY - endY == 2) return true;
            }
            else {              
              if(startY - endY == 1) return true;
            }
          }
          else {
            if(startY == 2) {              
              if(endY - startY == 1) return true;
              if(endY - startY == 2) return true;              
            }
            else {              
              if(endY - startY == 1) return true;
            }
          }          
        }
        else { console.log("Pawn Err")}        
        break;
    }

    return false;
  }
  moveChessMan(chessMan:string, startPos:string, endPos:string) :void {
    this.alterBoardStatus('00',startPos);
    this.alterBoardStatus(chessMan,endPos);
    //Pawn Rank Up
    this.startPos = "";
    this.endPos = "";
    this.activePlayer ="";
    let update = {
      room: this.room,
      startPos: startPos,
      endPos: endPos,
      chessMan: chessMan
    }
    this.chessService.updateBoard(update);
    let playerName = this.opponent[1]
    let blackOrWhite = this.opponent[2]=='1'? '黑子' : '白子';
    this.whoPlay = playerName + ' ' + blackOrWhite;    
  }
  alterBoardStatus(chessMan:string, boardPos:string) :void{
    for (var i=0; i<this.board.length; i++) {
      for (var j=0; j<this.board[i].length; j++){
        if( this.board[i][j][0] == boardPos) this.board[i][j][1]=chessMan;
      }
    }
  }

  test() {

    console.log("activePlayer",this.activePlayer);
    this.activePlayer = this.userID;
    console.log("activePlayer",this.activePlayer)
   // userID: string="";
    //room: string = "";
  }
  test2(event:any) {
    console.log(event);
    event.src="assets/02.jpg";
  }

}
