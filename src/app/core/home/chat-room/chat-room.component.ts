import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Message } from './chat-message.model';

@Component({
    selector: 'app-chat-room',
    templateUrl: 'chat-room.component.html',
    styleUrls: ['chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    messages: Message[]  = [];
    newMessage = '';

    constructor() {
        this.setFake();
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    addMessage() {

        const m = new Message();
        m.from = 'Me';
        m.text = this.newMessage;
        m.time = new Date();
        this.messages.push(m);
        this.newMessage = '';
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    setFake () {
        for (let i = 0; i < 15; i++) {
            const m = new Message();
            m.id = i;
            m.from = (i % 2 === 0) ? 'Anita' : 'Me';
            m.text = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
            m.time = new Date();

            this.messages.push(m);
            this.scrollToBottom();
        }
    }
}
