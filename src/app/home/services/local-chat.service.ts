import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { HubConnection } from '@aspnet/signalr-client';
import { UUID } from 'angular2-uuid';

import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IChatService } from './ichat.interface';

const hub_url = 'http://localhost:5300';
const chat_rooms_url = '/chat_rooms/';
const files_url = '/images/';
const users_url = '/users/';


@Injectable()
export class LocalChatService implements IChatService, OnDestroy {

    private _hubConnection: HubConnection;

    private avatars: Avatar[] = [];
    private chatRooms: ChatRoom[] = [];
    private subscribe_to_new_messages: Subscription;

    newMessageInRoom$: Subject<string> = new Subject<string>();
    messages$: Subject<Message[]> = new Subject<Message[]>();

    constructor() {
        this.openConnection();
    }


    private openConnection() {
        console.log('init');
        this._hubConnection = new HubConnection(hub_url + users_url);
        this._hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.error('Error while establishing connection :('));

    }


    public addMessage(message: Message) {
        const to = hub_url + chat_rooms_url + message.room_id;
        this._hubConnection
          .invoke(to, message)
          .catch(err => console.error(err));
    }

//#region Avatars

    public getAvatars(user_id: string): Observable<Array<Avatar>> {
        console.log('try get users');
        const to = 'avatars';
        const avatars$ = new Subject<Array<Avatar>>();

        this._hubConnection.on(to, avatars => {
            console.log(avatars);
            avatars$.next(avatars);
        });

        return avatars$;
    }

    public addAvatar(avatar: Avatar) {
        const to = 'avatars';
        console.warn(avatar);
        avatar.create_date = Date.now();
        this._hubConnection
          .invoke(to, avatar)
          .catch(err => console.error(err));
    }

    public removeAvatar(avatar: Avatar) {
        const to = 'remove';
        this._hubConnection
          .invoke(to, avatar.id)
          .catch(err => console.error(err));
    }

    //#endregion

//#region  Rooms
    public getRooms(): Observable<Array<string>> {
        const to = hub_url + chat_rooms_url + 'keys';
        const rooms$ = new Subject<Array<string>>();
        this._hubConnection.on(to, keys => {
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

            // subscribe to curent chat
            const to = hub_url + chat_rooms_url + chat_url;
            this._hubConnection.on(to, resp => {
                    this.newMessageInRoom$.next(this.getRoom(room).url);
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
