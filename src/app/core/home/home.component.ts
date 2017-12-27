import { Component, Inject } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromRoot from '../../ngrx/reducer';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { names_list, images_list } from './names';
import { Avatar, Room } from './chat.models';
import { ChatService } from './services/chat.service';


@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    names = names_list;
    images = images_list;
    bot_list = [];
    sel_room = '/chat_rooms/main';
    rooms: Room[] = [];

    constructor(public dialog: MatDialog, public chatService: ChatService, private store: Store<fromRoot.State>) {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const av = new Avatar;
        av.name = new_name;
        av.img = img_name;
        this.bot_list.unshift(av);
        this.addFakeRooms();
    }

    openDialogAddAvatar(): void {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        console.log(new_name);
        const dialogRef = this.dialog.open(DialogAddAvatar, {
          width: '250px',
          data: { new_name: new_name, img: img_name }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.addAvatar(new_name, img_name);
        });
    }

    addAvatar(name: string, img_name: string) {
        console.log('add avatar');
        const av = new Avatar;
        av.name = name;
        av.img = img_name;
        this.bot_list.unshift(av);
    }

    kill(key: string) {
        console.log('kill avatar = ' + key);
        const index = this.bot_list.indexOf(key, 0);
        if (index > -1) {
            this.bot_list.splice(index, 1);
        }
    }

    selectRoom(e) {
        console.log(e);
        this.sel_room = e;
        this.chatService.subscribeToChat(e);
    }

    addFakeRooms() {

        const r1 = new Room();
        r1.id = '123';
        r1.name = 'main';
        r1.url = '/chat_rooms/main';
        this.rooms.push(r1);

        const r2 = new Room();
        r2.id = '1234';
        r2.name = 'development';
        r2.url = '/chat_rooms/development';
        this.rooms.push(r2);

        const r3 = new Room();
        r3.id = '1235';
        r3.name = 'some_another_chat';
        r3.url = '/chat_rooms/some_another_chat';
        this.rooms.push(r3);
    }
}

@Component({
    selector: 'app-dialog-add-avatar',
    styleUrls: ['home.component.scss'],
    templateUrl: 'dialog-add-avatar.html',
})
export class DialogAddAvatar {

    constructor(public dialogRef: MatDialogRef<DialogAddAvatar>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}

