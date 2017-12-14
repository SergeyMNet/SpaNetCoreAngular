import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Input } from '@angular/core';

import { UUID } from 'angular2-uuid';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage } from './chat-message.model';

@Component({
    selector: 'app-chat-room',
    templateUrl: 'chat-room.component.html',
    styleUrls: ['chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    chat_url = '/chat_rooms';
    @Input() curent_username = 'Me';
    user: Observable<firebase.User>;
    messages: Message[];
    newMessage: NewMessage = new NewMessage();

    constructor(public afAuth: AngularFireAuth, public database: AngularFireDatabase) {
        this.afAuth.auth.signInAnonymously();
        // this.setFake();
        database.list<MessageApi>(this.chat_url).valueChanges().subscribe(
            (resp) => {
                this.messages = resp.map(item => {
                    return  <Message> {
                        id: item.id,
                        from: item.username,
                        text: item.message,
                        time: new Date(item.date_message)
                };
            });
            }
        );
        this.user = this.afAuth.authState;
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    addMessage() {
        this.database.list(this.chat_url).push(
            {
                attach: '',
                date_message: new Date().toUTCString(),
                id: UUID.UUID(),
                message: this.newMessage.text,
                photo: 'user',
                username: this.curent_username
            });
        this.newMessage.text = '';
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    setFake () {
        for (let i = 0; i < 15; i++) {
            const m = new Message();
            m.id = i.toString();
            m.from = (i % 2 === 0) ? 'Anita' : 'Me';
            m.text = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
            m.time = new Date();

            this.messages.push(m);
            this.scrollToBottom();
        }
    }
}
