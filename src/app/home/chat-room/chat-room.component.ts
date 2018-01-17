import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Message, MessageApi, NewMessage } from '../chat.models';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DialogEmojiList } from './dialogs/dialogEmojiList';

@Component({
    selector: 'app-chat-room',
    templateUrl: 'chat-room.component.html',
    styleUrls: ['chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild(MatInput) input;

    @Input() chat_url = '/chat_rooms/main';
    @Input() curent_user_name = 'Me';
    @Input() curent_user_img = 'Me';
    @Input() messages: Message[];
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    private newMessage: NewMessage = new NewMessage();

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    addMessage() {
        this.newMessage.fromAvatar = this.curent_user_name;
        this.newMessage.fromAvatarImg = this.curent_user_img;
        this.newMessage.toRoom = this.chat_url;
        this.newMessage.attach = '';
        this.addNewMessage.emit(this.newMessage);
        this.newMessage = new NewMessage();
    }

    insertEmoji(text: string) {
        this.newMessage.text += text;
        this.input.focus();
    }

    getEmotionList(): void {
        const dialogRef = this.dialog.open(DialogEmojiList, {
          width: '250px',
          data: ''
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result !== undefined) {
                this.insertEmoji(result);
            }
        });
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
