import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscribable } from 'rxjs/Observable';
import { HubConnection } from '@aspnet/signalr-client';
import { UUID } from 'angular2-uuid';

import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IChatService } from './ichat.interface';

const hub_url = 'http://localhost:5050';
const api_url = '/api/storage/';
const chat_rooms_url = '/chat_rooms/';
const files_url = '/images/';
const users_url = '/users/';
const messages_url = '/messages/';


@Injectable()
export class LocalChatService implements IChatService, OnDestroy {

    private _avatarsHubConnection: HubConnection;
    private _roomsHubConnection: HubConnection;
    private _messagesHubConnection: HubConnection;

    private avatars: Avatar[] = [];
    private chatRooms: ChatRoom[] = [];
    private subscribe_to_new_messages: Subscription;

    newMessageInRoom$: Subject<string> = new Subject<string>();
    messages$: Subject<Message[]> = new Subject<Message[]>();

    constructor(private http: HttpClient) {
        this.openConnection();
    }


    private openConnection() {
        console.log('init');
        this._avatarsHubConnection = new HubConnection(hub_url + users_url);
        this._avatarsHubConnection
          .start()
          .then(() => console.log('avatars Connection started!'))
          .catch(err => console.error('Error while establishing connection :('));

        this._roomsHubConnection = new HubConnection(hub_url + chat_rooms_url);
        this._roomsHubConnection
          .start()
          .then(() => console.log('rooms Connection started!'))
          .catch(err => console.error('Error while establishing connection :('));

        this._messagesHubConnection = new HubConnection(hub_url + messages_url);
        this._messagesHubConnection
          .start()
          .then(() => console.log('messages Connection started!'))
          .catch(err => console.error('Error while establishing connection :('));

    }


    public addMessage(message: Message) {
        const to = 'add';
        this._messagesHubConnection
           .invoke(to, message)
           .catch(err => console.error(err));
    }


//#region Avatars

    public getAvatars(user_id: string): Observable<Array<Avatar>> {
        console.log('try get users');
        const to = 'avatars';
        const avatars$ = new Subject<Array<Avatar>>();

        this.http.get(hub_url + api_url + 'avatars').take(1).subscribe(a => {
            const all = a as Array<Avatar>;
            avatars$.next(all);
        });

        this._avatarsHubConnection.on(to, avatars => {
            console.log(avatars);
            const all = avatars as Array<Avatar>;
            all.forEach(ava => {
                ava.rooms = [];
            });
            console.log(all);
            avatars$.next(all);
        });

        return avatars$;
    }

    public addAvatar(avatar: Avatar) {
        const to = 'add';
        avatar.create_date = Date.now();
        this._avatarsHubConnection
          .invoke(to, avatar)
          .catch(err => console.error(err));
    }

    public removeAvatar(avatar: Avatar) {
        const to = 'remove';
        this._avatarsHubConnection
          .invoke(to, avatar)
          .catch(err => console.error(err));
    }

    //#endregion

//#region  Rooms

    public getRooms(): Observable<Array<string>> {
        console.log('try get rooms');
        const to = 'rooms';
        const rooms$ = new Subject<Array<string>>();

        this.http.get(hub_url + api_url + 'rooms').take(1).subscribe(r => {
            const all = r as Array<string>;
            rooms$.next(all);
        });

        this._roomsHubConnection.on(to, keys => {
            console.log({message: 'geting rooms',  keys});
            rooms$.next(keys);
        });
        return rooms$;
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

            this.http.get(hub_url + api_url + 'messages').take(1).subscribe(m => {
                const all = m as Array<Message>;
                room.messagesArray = all.filter(mes => mes.room_id === room.room).map(item => {
                    room.hasNewMessage = true;
                    item.time = new Date(item.date_utc_string);
                    return item;
                });
            });

            // todo: subscribe to curent chat
            this._messagesHubConnection.on('messages', resp => {
                resp = resp.filter(m => m.room_id === room.room);
                console.log({message: 'geting messages filter',  resp});
                this.newMessageInRoom$.next(room.room);
                // add all messages to chat
                room.messages$.next(resp.map(item => {
                    room.hasNewMessage = true;
                    item.time = new Date(item.date_utc_string);
                    return item;
                }));

                room.messagesArray = resp.map(item => {
                    room.hasNewMessage = true;
                    item.time = new Date(item.date_utc_string);
                    return item;
                });
            });

            // add room
            const to = 'add';
            this._roomsHubConnection
                .invoke(to, chat_url)
                .catch(err => console.error(err));

            // save room
            this.chatRooms.push(room);
        }
    }

    public selectRoom(chat_url: string) {
        console.warn('sel ' + chat_url);
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

    ngOnDestroy() {
        console.log('-Unscribe local.chat.service-');
        this.chatRooms = [];
    }
    //#endregion

}
