import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  //playerName: string="";
  //roomName: string="";
  data = ["","","1"];
  constructor(
        private dialogRef: MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.    
  }

  onCreateClick() {
    //this.dialogRef.close();
  }
  onCloseClick() {
    this.dialogRef.close();
  }
  playerNameOnKey(event: any) {
    this.data[0] = event.target.value;    
  }
  playerNameBlur(event: any) {
    this.data[0] = event.target.value;      
  }
  roomNameOnKey(event: any) {
    this.data[1] = event.target.value;      
  }
  roomNameBlur(event: any) {
    this.data[1]= event.target.value;      
  }
  handleChange(event:any) {
    let target = event.target;
    if(target.checked){
      this.data[2] = target.value;
    }
  }

}
