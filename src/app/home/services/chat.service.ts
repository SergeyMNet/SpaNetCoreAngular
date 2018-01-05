import { Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage, ChatRoom, Room } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ChatService implements OnDestroy {

    private subscription: Subscription;
    private subscriptions: Subscription[] = [];
    private chatRooms: ChatRoom[] = [];
    private chatRooms$: Subject<ChatRoom> = new Subject<ChatRoom>();
    public getNewMessage$: Subject<Room> = new Subject<Room>();
    public messages$: Subject<Message[]> = new Subject<Message[]>();
    public rooms_keys$: Subject<string[]> = new Subject<string[]>();

    constructor(public database: AngularFireDatabase) {
        this.getRooms();
    }

    public getRooms() {
        this.database.object('/chat_rooms/')
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
                .valueChanges().subscribe(
                (resp) => {

                    // add all messages to chat
                    room.messages$.next(resp.map(item => {
                        this.getNewMessage$.next(this.getRoom(room));
                        room.hasNewMessage = true;
                        return <Message> {
                            id: item.id,
                            room_id: chat_url,
                            from: item.username,
                            text: item.message,
                            time: new Date(item.date_message)
                        };
                    }));

                    room.messagesArray = resp.map(item => {
                        this.getNewMessage$.next(this.getRoom(room));
                        room.hasNewMessage = true;
                        return <Message> {
                            id: item.id,
                            room_id: chat_url,
                            from: item.username,
                            text: item.message,
                            time: new Date(item.date_message)
                        };
                    });
            });

            // save subscription
            this.subscriptions.push(s);
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
            if (this.subscription !== undefined) {
                this.subscription.unsubscribe();
            }
            // subscribe to new messages
            this.subscription = this.chatRooms[index].messages$.subscribe(
                (resp) => {
                    this.messages$.next(resp);
                }
            );
        }
    }

    public addMessage(message: NewMessage) {
        console.log(message);
        // push new message to server
        this.database.list(message.toRoom).push(
            {
                attach: '',
                date_message: new Date().toUTCString(),
                id: UUID.UUID(),
                message: message.text,
                photo: 'user',
                username: message.fromAvatar,
                room_id: message.toRoom
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


//#region helpers
    private hasRoomInArray(arr: ChatRoom[], val: string): boolean {
        return arr.some(function(arrVal) {
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
