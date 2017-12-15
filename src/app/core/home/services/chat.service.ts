import { Input, Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage } from '../chat.models';

@Injectable()
export class ChatService implements OnDestroy {

    user: Observable<firebase.User>;
    private subscription: any;

    chat_url = '/chat_rooms';
    @Input() curent_username = '';

    messages: Message[];
    newMessage: NewMessage = new NewMessage();

    constructor(public afAuth: AngularFireAuth, public database: AngularFireDatabase) {
        this.afAuth.auth.signInAnonymously();
        this.user = this.afAuth.authState;
    }

    subscribeToChat(chat_url: string) {
        if (this.subscription != null) {
            this.subscription.unsubscribe();
        }

        this.subscription = this.database.list<MessageApi>(chat_url).valueChanges().subscribe(
            (resp) => {
                this.messages = resp.map(item => {
                    return <Message> {
                        id: item.id,
                        from: item.username,
                        text: item.message,
                        time: new Date(item.date_message)
                };
            });
            }
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
