import { Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage, ChatRoom, Room, Avatar, AvatarApi } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';


@Injectable()
export class ChatService implements OnDestroy {

    private subscribe_to_new_messages: Subscription;
    private subscription_rooms: Subscription;
    private subscriptions_to_chat_db: Subscription[] = [];
    private chatRooms: ChatRoom[] = [];

    public avatars$: Subject<Avatar[]> = new Subject<Avatar[]>();
    public rooms_keys$: Subject<string[]> = new Subject<string[]>();
    public newMessageInRoom$: Subject<string> = new Subject<string>();
    public messages$: Subject<Message[]> = new Subject<Message[]>();


    constructor(public database: AngularFireDatabase) {
    }

    public addMessage(message: NewMessage) {
        // push new message to server
        this.database.list(message.toRoom).push(
            {
                id: UUID.UUID(),
                date_message: new Date().toUTCString(),
                attach: message.attach,
                message: message.text,
                photo: message.fromAvatarImg,
                username: message.fromAvatar,
                room_id: message.toRoom
            });
    }

//#region Avatars CRUD

    public getAvatars(user_id: string) {
        this.subscription_rooms = this.database.list<AvatarApi>(users_url + user_id)
            .valueChanges().subscribe(users => {
                console.log('get users');
                console.log(users);
                this.avatars$.next(users.map(u => {
                    const av = new Avatar();
                    av.id = u.id;
                    av.uid = u.uid;
                    av.name = u.name;
                    av.img = u.img;
                    av.sel_room = u.sel_room;
                    return av;
                }));
            });
    }

    public addAvatar(avatar: Avatar) {

        this.database.database.ref(users_url + avatar.uid + '/' + avatar.id).set(
            {
                id: avatar.id,
                uid: avatar.uid,
                name: avatar.name,
                img: avatar.img,
                sel_room: avatar.sel_room
            });
    }

    public removeAvatar(avatar: Avatar) {
        console.log('remove ' + users_url + avatar.uid);
        this.database.list(users_url + avatar.uid + '/' + avatar.id).remove();
    }
//#endregion

//#region Rooms CRUD

    public getRooms() {
        this.subscription_rooms = this.database.object('/chat_rooms/')
            .valueChanges().subscribe(rooms => {
                const keys = Object.keys(rooms);
                this.rooms_keys$.next(keys);
            });
    }

    public subscribeToChat(chat_url: string) {
        // check existing room - if room already added
        const isOldChat = this.hasRoomInArray(this.chatRooms, chat_url);
        if (!isOldChat) {
            // create new chat-room
            const room = new ChatRoom();
            room.id = UUID.UUID();
            room.avatar = 'ALL';
            room.room = chat_url;
            room.messages$ = new Subject<Message[]>();

            // subscribe to curent chat
            const s = this.database.list<MessageApi>(chat_url)
                .valueChanges(['child_added']).subscribe(
                (resp) => {
                    this.newMessageInRoom$.next(this.getRoom(room).url);
                    // add all messages to chat
                    room.messages$.next(resp.map(item => {
                        room.hasNewMessage = true;
                        return <Message>{
                            id: item.id,
                            room_id: chat_url,
                            from: item.username,
                            photo: item.photo,
                            text: item.message,
                            time: new Date(item.date_message)
                        };
                    }));

                    room.messagesArray = resp.map(item => {
                        room.hasNewMessage = true;
                        return <Message>{
                            id: item.id,
                            room_id: chat_url,
                            from: item.username,
                            photo: item.photo,
                            text: item.message,
                            time: new Date(item.date_message)
                        };
                    });
                });

            // save subscription
            this.subscriptions_to_chat_db.push(s);
            // save room
            this.chatRooms.push(room);
        }
    }

    public selectRoom(chat_url: string) {
        // get current room
        const index = this.getIndex(this.chatRooms, 'room', chat_url);
        if (index > -1) {
            // get all old messages from current room
            const old = this.chatRooms[index].messagesArray;
            this.messages$.next(old);
            // unscribe from old room
            if (this.subscribe_to_new_messages !== undefined) {
                this.subscribe_to_new_messages.unsubscribe();
            }
            // subscribe to new messages
            this.subscribe_to_new_messages = this.chatRooms[index].messages$.subscribe(
                (resp) => {
                    this.messages$.next(resp);
                }
            );
        }
    }
//#endregion


    ngOnDestroy() {
        console.log('-Unscribe service-');
        this.chatRooms = [];
        if (this.subscribe_to_new_messages !== undefined && !this.subscribe_to_new_messages.closed) {
            this.subscribe_to_new_messages.unsubscribe();
        }
        if (this.subscription_rooms !== undefined && !this.subscription_rooms.closed) {
            this.subscription_rooms.unsubscribe();
        }
        this.subscriptions_to_chat_db.forEach(sub => {
            sub.unsubscribe();
        });
    }


    //#region helpers
    private hasRoomInArray(arr: ChatRoom[], val: string): boolean {
        return arr.some(function (arrVal) {
            return val === arrVal.room;
        });
    }
    private getRoom(r: ChatRoom): Room {
        const room = new Room();
        room.id = r.id;
        room.name = r.room;
        room.url = r.room;
        return room;
    }
    private getIndex(array: any[], attr, value): number {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    //#endregion
}
