import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Store } from '@ngrx/store';
import { UUID } from 'angular2-uuid';


import * as chat_models from '../chat.models';
import { ChatStore } from '../../store/interfaces';


@Injectable()
export class ChatStoreService {

    private subscription_rooms: Subscription;
    rooms$: Observable<Array<chat_models.Room>>;
    chats_url = '/chat_rooms/';

    constructor(private database: AngularFireDatabase,
                private store: Store<any>) {
        this.rooms$ = store.select( s => s.chatStore.rooms );
        this.loadRooms();
    }

    private loadRooms() {

        this.subscription_rooms = this.database.object(this.chats_url)
            .valueChanges()
            .subscribe(resp => {
                console.log('EVENT!');
                console.log(resp);
                const keys = Object.keys(resp);
                keys.forEach(k => {
                    this.store.dispatch({ type: 'ADD_ROOM', payload: k });
                    this.subscribeToMessages(k);
                });
                this.subscription_rooms.unsubscribe();
            });
    }

    public addRoom(room: string) {
        this.store.dispatch({ type: 'ADD_ROOM', payload: room });
    }

    private subscribeToMessages(room: string) {
        const chat_url = this.chats_url + room;
        const s = this.database.list<chat_models.MessageApi>(chat_url)
        .valueChanges(['child_added']).subscribe(
        (resp) => {
            const new_messages = resp.map(item => {
                return <chat_models.Message> {
                    id: item.id,
                    room_id: chat_url,
                    from: item.username,
                    photo: item.photo,
                    text: item.message,
                    time: new Date(item.date_message)
                };
            });
            this.store.dispatch({ type: 'ADD_MESSAGES', payload: new_messages });
        });
    }

    public addMessage(message: chat_models.NewMessage) {
        console.log(message);
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
        // this.store.dispatch({ type: 'ADD_MESSAGE', payload: message });
    }
}
