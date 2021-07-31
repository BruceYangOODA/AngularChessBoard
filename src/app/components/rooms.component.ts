import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogData } from './home.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  result: Array<any> = [''];
  constructor(public dialogRef: MatDialogRef<RoomsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<DialogData>) {       
    }

  ngOnInit(): void {
    console.log("roomdata",this.data);
  }  
  roomSelect(room: DialogData){
    this.result.push(room);
  }
  playerOnKey(event: any) {
    this.result[0] = event.target.value;    
  }
  playerBlur(event: any) {
    this.result[0] = event.target.value;      
  }
  onCloseClick() {
    this.dialogRef.close();
  }

}
