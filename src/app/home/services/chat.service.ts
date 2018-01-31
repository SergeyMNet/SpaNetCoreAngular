import { Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase';

import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IChatService } from './ichat.interface';

const files_url = '/images/';
const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';


@Injectable()
export class ChatService implements OnDestroy, IChatService {

    private subscribe_to_new_messages: Subscription;
    private ngUnsubscribeAll: Subscription[] = [];
    private chatRooms: ChatRoom[] = [];

    public newMessageInRoom$: Subject<string> = new Subject<string>();
    public messages$: Subject<Message[]> = new Subject<Message[]>();

    private itemsCollection: AngularFirestoreCollection<File>;
    private items: Observable<File[]>;
    progress: {percentage: number} = { percentage: 0 };

    constructor(private database: AngularFireDatabase,
                private store: AngularFirestore) {
    }


//#region Messages CRUD
    public addMessage(message: Message) {

        // push new message to server
        if (message.attachFile === null) {
            this.database.list(message.room_id).push(message);
        } else {
            this.pushUpload(message);
        }
    }

    private pushUpload(message: Message) {
        const upload: Upload = message.attachFile;
        const storageRef = firebase.storage().ref();
        const uploadTask = storageRef.child(`${files_url}/${message.attachFile.file.name}`).put(message.attachFile.file);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            // TODO: show progress loading
            const snap = snapshot as firebase.storage.UploadTaskSnapshot;
            this.progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          },
          (error) => {
            // todo: show fail
            console.error(error);
          },
          () => {
            // success
            message.attach = uploadTask.snapshot.downloadURL;
            console.log(uploadTask.snapshot.downloadURL);
            this.database.list(message.room_id).push(message);
          }
        );
      }
//#endregion

//#region Avatars CRUD

    public getAvatars(user_id: string): Observable<Array<Avatar>> {
        return this.database.list<Avatar>(users_url + user_id)
            .valueChanges().map(users => {
                console.log('get users');
                console.log(users);
                return users
                    .map(u => {
                        const av = new Avatar();
                        av.id = u.id;
                        av.uid = u.uid;
                        av.name = u.name;
                        av.img = u.img;
                        av.sel_room = u.sel_room;
                        av.create_date = u.create_date;
                        return av;
                });
            });
    }

    public addAvatar(avatar: Avatar) {
        this.database.database.ref(users_url + avatar.uid + '/' + avatar.id).set(
            {
                id: avatar.id,
                uid: avatar.uid,
                name: avatar.name,
                img: avatar.img,
                create_date: Date.now(),
                sel_room: avatar.sel_room
            });
    }

    public removeAvatar(avatar: Avatar) {
        console.log('remove ' + users_url + avatar.uid);
        this.database.list(users_url + avatar.uid + '/' + avatar.id).remove();
    }
//#endregion

//#region Rooms CRUD

    public getRooms(): Observable<Array<string>> {
        return this.database.object('/chat_rooms/')
            .valueChanges().map(rooms => {
                console.log('get rooms');
                if (rooms !== null) {
                    const keys = Object.keys(rooms);
                    console.log(keys);
                    return keys;
                } else {
                    // add init message
                    const initMessage = new Message();
                    initMessage.from = 'admin';
                    initMessage.date_utc_string = new Date().toUTCString();
                    initMessage.text = 'init chat';
                    this.database.list(chat_rooms_url + 'main').push(initMessage);
                }
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
            const s = this.database.list<Message>(chat_url)
                .valueChanges(['child_added']).subscribe(
                (resp) => {
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

            this.ngUnsubscribeAll.push(s);
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
        console.log('-Unscribe chat.service-');
        this.ngUnsubscribeAll.forEach(uns => uns.unsubscribe());
        if (this.subscribe_to_new_messages !== undefined) {
            this.subscribe_to_new_messages.unsubscribe();
        }
        this.chatRooms = [];
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
