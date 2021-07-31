import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board.component';
import { HomeComponent } from './components/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from "@angular/material/dialog";
import { DialogComponent } from './components/dialog.component'
import { RouterModule, Routes } from "@angular/router";
import { RoomsComponent } from './components/rooms.component';

const routes: Routes = [
  {path:"home", component:HomeComponent},
  {path:"board/:room", component:BoardComponent},
  {path:"**", redirectTo:"/home"},
];

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    HomeComponent,
    DialogComponent,
    RoomsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatDialogModule,
    
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
