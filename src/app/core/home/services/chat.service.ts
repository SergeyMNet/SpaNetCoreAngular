import { Input, Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage, ChatRoom, Room } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class ChatService implements OnDestroy {

    private user: Observable<firebase.User>;
    private subscription: Subscription;
    private subscriptions: Subscription[] = [];
    private chatRooms: ChatRoom[] = [];
    public getNewMessage: Subject<Room> = new Subject<Room>();
    public messages: Subject<Message[]> = new Subject<Message[]>();
    public allMessages: Message[] = [];


    constructor(public afAuth: AngularFireAuth, public database: AngularFireDatabase) {
        this.afAuth.auth.signInAnonymously();
        this.user = this.afAuth.authState;
    }

    public subscribeToChat(avatar: string, chat_url: string) {
        const isOldChat = this.hasRoomInArray(this.chatRooms, chat_url);
        if (!isOldChat) {

            const room = new ChatRoom();
            room.id = UUID.UUID();
            room.avatar = avatar;
            room.room = chat_url;
            room.messages = new Subject<Message[]>();

            const s = this.database.list<MessageApi>(chat_url)
                .valueChanges().subscribe(
                (resp) => {
                room.messages.next(resp.map(item => {
                    this.getNewMessage.next(this.getRoom(room));
                    room.hasNewMessage = true;
                    return <Message> {
                        id: item.id,
                        room_id: chat_url,
                        from: item.username,
                        text: item.message,
                        time: new Date(item.date_message)
                    };
                }));
                resp.forEach(element => {
                    this.allMessages.push({
                        id: element.id,
                        room_id: chat_url,
                        from: element.username,
                        text: element.message,
                        time: new Date(element.date_message)
                    });
                });
            });

            this.subscriptions.push(s);
            this.chatRooms.push(room);
        }
    }

    public selectRoom(chat_url: string) {
        const index = this.getIndex(this.chatRooms, 'room', chat_url);
        const old = this.getByProp(this.allMessages, 'room_id', chat_url);
        this.messages.next(old);
        if (index > -1) {
            if (this.subscription !== undefined) {
                this.subscription.unsubscribe();
            }
            this.subscription = this.chatRooms[index].messages.subscribe(
                (resp) => {
                    this.messages.next(resp);
                }
            );
        }
    }

    public addMessage(message: NewMessage) {
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

    // helpers
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
    private getByProp(array: any[], attr, value): any[] {
        const result = [];
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                result.push(array[i]);
            }
        }
        return result;
    }
}
