import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { HubConnection } from '@aspnet/signalr-client';
import { UUID } from 'angular2-uuid';

import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IChatService } from './ichat.interface';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

const hub_url = 'http://localhost:5300';
const chat_rooms_url = '/chat_rooms/';
const files_url = '/images/';
const users_url = '/users/';


@Injectable()
export class LocalChatService implements OnInit, IChatService {

    private _hubConnection: HubConnection;

    private chatRooms: ChatRoom[] = [];
    private subscribe_to_new_messages: Subscription;
    avatars$: Subject<Avatar[]>;
    rooms_keys$: Subject<string[]>;
    newMessageInRoom$: Subject<string>;
    messages$: Subject<Message[]>;


    ngOnInit(): void {
        this.openConnection();
    }

    private openConnection() {
        this._hubConnection = new HubConnection(hub_url);
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

    public getAvatars(user_id: string) {
        const to = hub_url + users_url + user_id;
        this._hubConnection.on(to, resp => {
            this.avatars$.next(resp);
        });
    }

    public addAvatar(avatar: Avatar) {
        const to = hub_url + users_url + avatar.id;
        this._hubConnection
          .invoke(to, avatar)
          .catch(err => console.error(err));
    }

    public removeAvatar(avatar: Avatar) {
        const to = hub_url + users_url + 'remove';
        this._hubConnection
          .invoke(to, avatar)
          .catch(err => console.error(err));
    }

    public getRooms() {
        const to = hub_url + chat_rooms_url + 'keys';
        this._hubConnection.on(to, keys => {
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
