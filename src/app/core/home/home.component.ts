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

    sel_avatar = 0;
    bot_list: Avatar[] = [];
    messages: Message[] = [];
    messages$: Subject<Message[]> = new Subject<Message[]>();

    constructor(public dialog: MatDialog, public chatService: ChatService) {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const av = new Avatar;
        av.name = new_name;
        av.img = img_name;
        this.bot_list.unshift(av);
        this.addMainRoom();
    }

    ngOnInit() {
        this.chatService.subscribeToChat(this.bot_list[this.sel_avatar].sel_room);
        this.subscribeToChat();
        this.chatService.selectRoom(this.bot_list[this.sel_avatar].sel_room);
    }

    subscribeToChat() {
        // subscribe to new messages
        this.messages$ = this.chatService.messages$;

        this.chatService.messages$.subscribe(
            (resp) => {
                this.messages = resp;
            }
        );

        // subscribe to new in room
        this.chatService.getNewMessage$.subscribe(
            (resp) => {
                console.log('some event');
                this.bot_list.forEach(bot => {
                    bot.rooms.forEach(element => {
                        const hasNew = element.url === resp.url && (bot.sel_room !== this.bot_list[this.sel_avatar].sel_room );
                        if (hasNew) {
                            element.hasNewMessage = hasNew;
                        }
                    });
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
        const av = new Avatar();
        av.name = name;
        av.img = img_name;
        this.bot_list.unshift(av);
        this.sel_avatar = 0;
        this.addMainRoom();
        this.selectAvatar();
    }

    kill(key: Avatar) {
        const index = this.getIndex(this.bot_list, 'name', key.name);
        if (index > -1) {
            this.bot_list.splice(index, 1);
        }
    }

    selectAvatar() {
        console.log('sel avatar');
        this.chatService.selectRoom(this.bot_list[this.sel_avatar].sel_room);
    }
    //#endregion

//#region RoomMNG
    selectRoom(e: string) {
        this.bot_list[this.sel_avatar].sel_room = e;
        this.chatService.selectRoom(e);
    }
    addRoom(e: Room) {
        this.chatService.subscribeToChat(e.url);
        this.bot_list[this.sel_avatar].rooms.push(e);
    }
    //#endregion

// Add main rooms
    addMainRoom() {
        const r1 = new Room();
        r1.id = '1';
        r1.name = 'main';
        r1.url = '/chat_rooms/main';
        this.bot_list[this.sel_avatar].rooms.push(r1);

        const r2 = new Room();
        r2.id = '2';
        r2.name = 'dev';
        r2.url = '/chat_rooms/dev';
        this.addRoom(r2);
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

