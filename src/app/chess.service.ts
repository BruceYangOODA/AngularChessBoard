import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { observable, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  private socket: Socket;
  private url = "http://localhost:3000";
  private userID: string = "" ;

  constructor() {     
    this.socket = io(this.url, {transports: ['websocket', 'polling', 'flashsocket']});
  }

  reciveUserID() {
    this.socket.emit("require socket id");
    let observable = new Observable<string>(observer => {
      this.socket.on("your id", (socketID)=> {
        this.userID = socketID;
        observer.next(socketID);
      });
    });
    return observable;
  }

  reciveRoomStatus(room: string): Observable<any> {    
    this.socket.emit("require game status", room);
    let observable = new Observable<any>(observer =>{
      this.socket.on("recive game status", (gameData) =>{
        if (gameData == null) {}
        observer.next(gameData);
        observer.complete();
      });
    });
    return observable;
  }

  createRoom(roomData :Array<string>) :Observable<boolean> {
    let gameStatus = {
      player: [this.userID, roomData[0], roomData[2]],
      room: roomData[1],
      userID : this.userID
    }
    this.socket.emit("create room", gameStatus);
    let observable = new Observable<boolean>( observer =>{
      this.socket.on("game ready", (isReady) => {
        observer.next(isReady);
      });
    });

    return observable;    
  }

  joinGame(room: string, palyerName: string){
    let player = [this.userID, palyerName];
    let playerData = {
      room:room,
      player:player
    }
    this.socket.emit("join game",playerData);
    let observable = new Observable<boolean>(observer => {
      this.socket.on("game start", (isGameStart) =>{
        observer.next(isGameStart);
      });
    });
    return observable;
  }

  waitPlayer() {
    let obsrevable = new Observable<Array<string>>(observer =>{
      this.socket.on("palyer joined", (player) =>{
        observer.next(player);
      });
    });
    return obsrevable;
  }

  updateBoard(data: Object) {
    this.socket.emit("update board", data);
  }
  reciveUpdateBoard() {
    let observable = new Observable<Object>(observer => {
      this.socket.on('update board', (update) => {
        observer.next(update);
      });
    });
    return observable;
  }

  requireRooms(): Observable<any>{
    this.socket.emit("require rooms data");
    let observable = new Observable<any>(observer =>{
      this.socket.on("recive rooms data",(rooms) => {
        observer.next(rooms);
      });
    });

    return observable;
  }




}
