import { Component, Inject, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { Room } from '../chat.models';

@Component({
    selector: 'app-rooms-list',
    templateUrl: 'rooms-list.component.html',
    styleUrls: ['rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {

    sel_room: Room = new Room();
    @Input() sel_room_url: string = '';
    @Input() rooms: Room[] = [];
    @Output() addRoom: EventEmitter<any> = new EventEmitter();
    @Output() selectRoom: EventEmitter<any> = new EventEmitter();

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        this.startSelRoom();
    }

    startSelRoom() {
        this.rooms.forEach(r => {
            if (r.url === this.sel_room_url) {
                this.sel_room = r;
            }
        });
    }

    selRoom(room: Room) {
        this.sel_room = room;
        this.selectRoom.emit(this.sel_room.url);
        const index = this.rooms.indexOf(room, 0);
        this.rooms[index].hasNewMessage = false;
    }

    // Add new Room
    addNewRoom() {
        this.openDialog();
    }
    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          width: '250px',
          data: { new_room: new Room() }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            this.saveRoom(result);
        });
    }
    saveRoom(room: Room) {
        if (room != null && room.name != null && room.name.length > 0) {
            const r = new Room(room.name);
            this.addRoom.emit(r);
            this.sel_room = r;
            this.selectRoom.emit(this.sel_room.url);
            console.log('saved');
        } else {
            console.log('canceled');
        }
    }
}

@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog-add-room.html',
})
export class DialogOverviewExampleDialog {

    constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}

