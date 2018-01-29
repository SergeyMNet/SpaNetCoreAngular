import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Message, Upload } from '../chat.models';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DialogEmojiList } from './dialogs/dialogEmojiList';

@Component({
    selector: 'app-chat-room',
    templateUrl: 'chat-room.component.html',
    styleUrls: ['chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    @ViewChild('input') private myInputContainer: ElementRef;
    @ViewChild(MatInput) input;

    @Input() chat_url = '/chat_rooms/main';
    @Input() curent_user_name = 'Me';
    @Input() curent_user_img = 'Me';
    @Input() messages: Message[];
    @Output() addNewMessage: EventEmitter<any> = new EventEmitter();
    @Output() addNewFileMessage: EventEmitter<any> = new EventEmitter();
    private newMessage: Message = new Message();
    private selectedFiles: FileList | null;
    private currentUpload: Upload;

    constructor(public dialog: MatDialog) {
        this.newMessage.text = '';
    }

    ngOnInit() {
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    addMessage(attach: Upload = null) {
        this.newMessage.from = this.curent_user_name;
        this.newMessage.photo = this.curent_user_img;
        this.newMessage.room_id = this.chat_url;
        this.newMessage.attachFile = attach;
        this.newMessage.date_utc_string = new Date().toUTCString();
        this.addNewMessage.emit(this.newMessage);
        this.newMessage = new Message();
        this.newMessage.text = '';
    }

    detectFiles($event: Event) {
        this.selectedFiles = ($event.target as HTMLInputElement).files;
        const file = this.selectedFiles;
        if (file && file.length === 1) {
            this.currentUpload = new Upload(file.item(0));
            this.addMessage(this.currentUpload);
        }
    }

    insertFile() {
        try {
            this.myInputContainer.nativeElement.click();
        } catch (err) { }
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
