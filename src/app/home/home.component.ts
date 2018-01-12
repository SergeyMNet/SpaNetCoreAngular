import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth';
import { names_list, images_list } from './names';
import { Avatar, Room, Message, NewMessage } from './chat.models';
import { ChatService } from './services/chat.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from 'angular2-uuid';


@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    names = names_list;
    images = images_list;

    sub_rooms: Subscription;
    sub_messages: Subscription;
    sub_new_messages: Subscription;

    sel_avatar = 0;
    bot_list: Avatar[] = [];
    messages: Message[] = [];
    all_rooms: Room[] = [];

    constructor(public auth: AuthService,
                public dialog: MatDialog,
                public chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.getRooms();
        this.subscribeToChat();
        if (this.bot_list.length > 0) {
            this.chatService.subscribeToChat(this.bot_list[this.sel_avatar].sel_room);
            this.chatService.selectRoom(this.bot_list[this.sel_avatar].sel_room);
        }
    }

    subscribeToChat() {

        this.sub_rooms = this.chatService.rooms_keys$.subscribe(
            (resp) => {
                this.all_rooms = resp.map(name => {
                    return new Room(name);
                });
            }
        );

        // subscribe to new messages
        this.sub_messages = this.chatService.messages$.subscribe(
            (resp) => {
                this.messages = resp;
            }
        );

        // subscribe to new in room
        this.sub_new_messages = this.chatService.getNewMessage$.subscribe(
            (resp) => {
                this.bot_list.forEach(bot => {
                    bot.rooms.forEach(element => {
                        const hasNew = element.url === resp.url
                                && (resp.url !== this.bot_list[this.sel_avatar].sel_room
                                || bot.id !== this.bot_list[this.sel_avatar].id);
                        console.log(hasNew);
                        if (hasNew) {
                            element.hasNewMessage = hasNew;
                        }
                    });
                });
        });
    }

    addNewMessage(message: NewMessage) {
        this.chatService.addMessage(message);
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
        av.id = UUID.UUID();
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

    // Add main rooms
    addMainRoom() {
        this.all_rooms.forEach(r => {
            this.addRoom(r);
        });
    }

    //#endregion

    // helpers
    private getIndex(array: any[], attr, value): number {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }


    ngOnDestroy() {
        console.log('-onDestroy-');
        this.sub_rooms.unsubscribe();
        this.sub_messages.unsubscribe();
        this.sub_new_messages.unsubscribe();
        this.chatService.ngOnDestroy();
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

