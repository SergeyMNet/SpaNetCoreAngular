import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth';
import { names_list, images_list } from './names';
import { Avatar, Room, Message, Upload } from './chat.models';
import { ChatService } from './services/chat.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from 'angular2-uuid';
import { DialogAddAvatar } from './dialogAddAvatar';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    names = names_list;
    images = images_list;

    private ngUnsubscribe = new Subject();
    user_id = '';
    sel_avatar = 0;
    avatars: Avatar[] = [];
    messages: Message[] = [];
    all_rooms: Room[] = [];

    new_for_avatars: string[] = [];


    constructor(public auth: AuthService,
                public dialog: MatDialog,
                public chatService: ChatService) {
    }

    ngOnInit() {

        // #4 subscriptions avatars/rooms/messages/new
        this.subscribeToChat();

        // #1 get user ID
        this.auth.uid$.takeUntil(this.ngUnsubscribe).subscribe(
            // #2 get avatars by uid
            uid => {
                this.user_id = uid;
                // #3 get rooms (all)
                this.chatService.getRooms();
                this.chatService.getAvatars(uid);
            }
        );
    }

    subscribeToChat() {

        // subscribe to avatars
        this.chatService.avatars$.takeUntil(this.ngUnsubscribe).subscribe(
            (resp) => {
                console.log(resp);
                // sort by time
                resp = resp.sort((a, b) => {
                    if (a.create_date > b.create_date) {
                      return -1;
                    }
                    if (a.create_date < b.create_date) {
                      return 1;
                    }
                    return 0;
                });
                this.avatars = resp;
                this.avatars.forEach(bot => {
                    this.all_rooms.forEach(r => bot.rooms.push(new Room(r.name)));
                });
                this.sel_avatar = 0;
            }
        );

        // subscribe to rooms
        this.chatService.rooms_keys$.takeUntil(this.ngUnsubscribe).subscribe(
            (resp) => {
                this.all_rooms = resp.map(name => new Room(name) );
                this.subscribeToRooms();
             }
        );

        // subscribe to new messages
        this.chatService.messages$.takeUntil(this.ngUnsubscribe).subscribe(
            (resp) => { this.messages = resp; }
        );

        // subscribe to new in room
        this.chatService.newMessageInRoom$.takeUntil(this.ngUnsubscribe).subscribe(
            (url) => {
                let i = 0;
                this.avatars.forEach(bot => {
                    bot.rooms.forEach(room => {
                        const hasNew = room.url === url && bot.id !== this.avatars[this.sel_avatar].id;
                        if (hasNew) {
                            room.hasNewMessage = hasNew;

                            // set alarm css to new message for avatar
                            const ava = 'avatar' + i;
                            const ind = this.new_for_avatars.indexOf(ava);
                            if (ind > -1) { this.new_for_avatars.splice(ind, 1); }
                            this.new_for_avatars.push(ava);
                        }
                    });
                    i++;
                });
        });
    }

// Add new message
    addNewMessage(message: Message) {
        this.chatService.addMessage(message);
    }


//#region Avatars CRUD

    addAvatar(av: Avatar) {
        this.chatService.addAvatar(av);
    }

    kill(key: Avatar) {
        this.chatService.removeAvatar(key);
    }

    selectAvatar() {
        this.chatService.selectRoom(this.avatars[this.sel_avatar].sel_room);

        // clear alarm
        const ind = this.new_for_avatars.indexOf('avatar' + this.sel_avatar);
        if (ind > -1) { this.new_for_avatars.splice(ind, 1); }
    }

    openDialogAddAvatar(): void {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const dialogRef = this.dialog.open(DialogAddAvatar, {
          width: '250px',
          data: { new_name: new_name, img: img_name }
        });

        dialogRef.afterClosed().subscribe(result => {
            const av = new Avatar();
            av.name = new_name;
            av.img = img_name;
            av.id = UUID.UUID();
            av.uid = this.user_id;
            this.addAvatar(av);

        });
    }
//#endregion

//#region Rooms CRUD

    selectRoom(e: string) {
        this.avatars[this.sel_avatar].sel_room = e;
        this.chatService.selectRoom(e);
    }

    subscribeToRooms() {
        this.all_rooms.forEach(r => {
            this.chatService.subscribeToChat(r.url);
        });
    }

    addRoom(e: Room) {
        this.chatService.subscribeToChat(e.url);
        this.avatars[this.sel_avatar].rooms.push(e);
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
        this.ngUnsubscribe.unsubscribe();
        this.chatService.ngOnDestroy();
    }
}

