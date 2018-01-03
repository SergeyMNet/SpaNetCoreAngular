import { Component, Inject, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { names_list, images_list } from './names';
import { Avatar, Room, Message, NewMessage } from './chat.models';
import { ChatService } from './services/chat.service';
import { Subject } from 'rxjs/Subject';


@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

    names = names_list;
    images = images_list;

    sel_avatar = '';
    bot_list: Avatar[] = [];

    sel_room = '/chat_rooms/main';
    rooms: Room[] = [];

    messages$: Subject<Message[]> = new Subject<Message[]>();

    constructor(public dialog: MatDialog, public chatService: ChatService) {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const av = new Avatar;
        av.name = new_name;
        av.img = img_name;
        this.bot_list.unshift(av);
        this.addFakeRooms();
    }

    ngOnInit() {
        this.chatService.subscribeToChat(this.bot_list[0].name, this.sel_room);
        this.subscribeToChat();
        this.chatService.selectRoom(this.sel_room);
    }

    subscribeToChat() {
        this.messages$ = this.chatService.messages$;

        this.chatService.getNewMessage$.subscribe(
            (resp) => {
                this.rooms.forEach(element => {
                    element.hasNewMessage = element.url === resp.url && resp.url !== this.sel_room;
                });
        });
    }

    addNewMessage(e: NewMessage) {
        this.chatService.addMessage(e);
    }

//#region AvatarMNG
    openDialogAddAvatar(): void {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const dialogRef = this.dialog.open(DialogAddAvatar, {
          width: '250px',
          data: { new_name: new_name, img: img_name }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.addAvatar(new_name, img_name);
        });
    }

    addAvatar(name: string, img_name: string) {
        const av = new Avatar;
        av.name = name;
        av.img = img_name;
        this.bot_list.unshift(av);
    }

    kill(key: Avatar) {
        const index = this.getIndex(this.bot_list, 'name', key.name);
        if (index > -1) {
            this.bot_list.splice(index, 1);
        }
    }
    //#endregion

//#region RoomMNG
    selectRoom(e: string) {
        this.sel_room = e;
        this.chatService.selectRoom(e);
    }
    addRoom(e: Room) {
        this.chatService.subscribeToChat(this.bot_list[0].name, e.url);
        this.rooms.push(e);
    }
    //#endregion

// Fake data
    addFakeRooms() {

        const r1 = new Room();
        r1.id = '123';
        r1.name = 'main';
        r1.url = '/chat_rooms/main';
        this.rooms.push(r1);
    }

    // helpers
    private getIndex(array: any[], attr, value): number {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
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

