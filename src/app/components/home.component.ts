import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { DialogComponent } from './dialog.component';
import { ChessService } from '../chess.service';
import { Router } from '@angular/router';
import { RoomsComponent } from './rooms.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  constructor(public dialog: MatDialog,
    private chessService: ChessService,
    private _router:Router) {      
      this.chessService.reciveUserID().subscribe(); 
    }

  ngOnInit(): void {
  }
  createGame(): void{
    let dialogRef = this.dialog.open(DialogComponent);
    dialogRef.afterClosed().subscribe(result => {          
      if(result == undefined) return;
      if(result[0] =="" || result[1]=="") return ;              
        this.chessService.createRoom(result).subscribe((isReady) =>{
          if(isReady) { this._router.navigate(['board',result[1]]); }
          else alert("遊戲創建失敗")
        });
    });
  }

  joinGame(): void{
    this.chessService.requireRooms().subscribe((rooms) => {
      let roomData = JSON.parse(JSON.stringify(rooms));
      if (roomData) {
        const dialogRef = this.dialog.open(RoomsComponent, {data: roomData});
        dialogRef.afterClosed().subscribe(result =>{
          let room = result[1].room;
          let isGameStart = result[1].gameStart;
          let playerName = result[0];       
          if (playerName == "") { alert("取輸入玩家名稱"); return; }   
          if(isGameStart) this._router.navigate(['board',room]);
          else {
            this.chessService.joinGame(room, playerName).subscribe((isGameReady) =>{
              if(isGameReady) this._router.navigate(['board',room]);
              else this._router.navigate(['home']);
            });
            
          }
        });
      }
    });
  }
  test(){
    this._router.navigate(['board',"123"]);
  }

}

export interface DialogData {
  room: string,
  gameStart: boolean,
}
