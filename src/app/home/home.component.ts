import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth';
import { names_list, images_list } from './names';
import { Avatar, Room, Message, Upload } from './chat.models';
import { ChatService } from './services/chat.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/takeUntil';
import { UUID } from 'angular2-uuid';
import { DialogAddAvatar } from './dialogAddAvatar';
import { observeOn } from 'rxjs/operators/observeOn';
import { retry } from 'rxjs/operators/retry';
import { LocalChatService } from './services/index';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    names = names_list;
    images = images_list;

    private isReady = false;
    destroy$: Subject<boolean> = new Subject<boolean>();
    user_id = '';
    sel_avatar = 0;
    avatars: Avatar[] = [];
    messages: Message[] = [];
    all_rooms: Room[] = [];
    all_rooms$: Subject<Room[]> = new Subject<Room[]>();

    new_for_avatars: string[] = [];


    constructor(public auth: AuthService,
                public dialog: MatDialog,
                public chatService: ChatService,
                // public chatService: LocalChatService
            ) {
    }

    ngOnInit() {
        // #1 get user ID
        this.auth.uid$.takeUntil(this.destroy$).subscribe(
            uid => {
                this.user_id = uid;
                this.subscribeToChat(uid);
            }
        );
    }

    subscribeToChat(user_id: string) {

        // #2 get avatars by uid
        this.chatService.getAvatars(user_id).takeUntil(this.destroy$).subscribe(
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
                    bot.rooms = this.getNewArray(this.all_rooms);
                    this.all_rooms$.takeUntil(this.destroy$).subscribe(rooms => {
                        bot.rooms = this.getNewArray(rooms);
                    });
                });
                this.sel_avatar = 0;
                this.ready();
            }
        );

        // #3 get all rooms
        this.chatService.getRooms().takeUntil(this.destroy$).subscribe(
            (resp) => {
                this.all_rooms = [];
                this.all_rooms$.next(resp.map(name => {
                     const r = new Room(name);
                     this.chatService.subscribeToChat(r.url);
                     this.all_rooms.push(r);
                     this.ready();
                     return r;
                    }));
             }
        );

        // #4 subscribe to new messages
        this.chatService.messages$.takeUntil(this.destroy$).subscribe(
            (resp) => { this.messages = resp; }
        );

        // #5 subscribe to new in room
        this.chatService.newMessageInRoom$.takeUntil(this.destroy$).subscribe(
            (url) => {
                console.log('try get new!');
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


    // select room after loading avatars and rooms
    ready() {
        console.warn({m: 'try ready', r: this.all_rooms, a: this.avatars});
        if (!this.isReady && this.all_rooms.length > 0 && this.avatars.length > 0) {
            this.isReady = true;
            this.selectRoom(this.avatars[0].sel_room);
        }
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

        dialogRef.afterClosed().takeUntil(this.destroy$).subscribe(result => {
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

    addRoom(e: Room) {
        this.chatService.subscribeToChat(e.url);
        this.pushInitMessage(e.url);
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

    private getNewArray(arr: Array<any>): Array<any> {
        const newArray = [];
        arr.forEach(item => {
            newArray.push({...item});
        });
        return newArray;
    }

    private pushInitMessage(url: string) {
        const m = new Message();
        m.room_id = url;
        m.text = 'Hi!';
        m.attachFile = null;
        m.from = this.avatars[this.sel_avatar].name;
        m.photo = this.avatars[this.sel_avatar].img;
        m.date_utc_string = new Date().toUTCString();
        this.addNewMessage(m);
    }

    ngOnDestroy() {
        console.log('-onDestroy home-');
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.chatService.ngOnDestroy();
    }
}

