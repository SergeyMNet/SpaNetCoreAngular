import { Input, Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage } from '../chat.models';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChatService implements OnDestroy {

    private user: Observable<firebase.User>;
    private subscription: any;
    public messages: Subject<Message[]> = new Subject<Message[]>();

    constructor(public afAuth: AngularFireAuth, public database: AngularFireDatabase) {
        this.afAuth.auth.signInAnonymously();
        this.user = this.afAuth.authState;
    }

    public subscribeToChat(chat_url: string) {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }
        this.subscription =
            this.database.list<MessageApi>(chat_url)
                .valueChanges().subscribe(
                (resp) => {
                this.messages.next(resp.map(item => {
                    console.log(item);
                    return <Message> {
                        id: item.id,
                        from: item.username,
                        text: item.message,
                        time: new Date(item.date_message)
                };
            }));
            }
        );
    }

    public addMessage(user_name: string, chat_url: string, new_message: string) {
        console.log('user_name:' + user_name + ', chat_url: ' + chat_url + ', new_message: ' + new_message);
        this.database.list(chat_url).push(
            {
                attach: '',
                date_message: new Date().toUTCString(),
                id: UUID.UUID(),
                message: new_message,
                photo: 'user',
                username: user_name
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
