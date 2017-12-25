import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Input } from '@angular/core';

import { UUID } from 'angular2-uuid';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

import { Message, MessageApi, NewMessage } from '../chat.models';
import { ChatService } from '../services/chat.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
    selector: 'app-chat-room',
    templateUrl: 'chat-room.component.html',
    styleUrls: ['chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    @Input() chat_url = '/chat_rooms/main';
    @Input() curent_user_name = 'Me';
    @Input() curent_user_img = 'Me';
    private subscription: any;
    private user: Observable<firebase.User>;
    private messages: Message[];
    private newMessage: NewMessage = new NewMessage();

    constructor(public chatService: ChatService) {
    }

    ngOnInit() {
        this.subscribeToChat();
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    subscribeToChat() {
        this.chatService.subscribeToChat(this.chat_url);
        this.chatService.messages.subscribe(
            (resp) => {
                this.messages = resp.map(item => {
                    return <Message> {
                        id: item.id,
                        from: item.from,
                        text: item.text,
                        time: new Date(item.time)
                        };
                    });
        });
    }

    addMessage() {
        this.chatService.addMessage(this.curent_user_name, this.chat_url, this.newMessage.text);
        this.newMessage.text = '';
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
