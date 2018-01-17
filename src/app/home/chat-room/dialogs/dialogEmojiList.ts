import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog-emoji-list',
    templateUrl: 'dialog-emoji-list.html',
    styleUrls: ['../chat-room.component.scss'],
})

export class DialogEmojiList {


    sel_emoji = ':smile:';
    emojies = [
        ':smile:',
        ':smiley:',
        ':relaxed:',
        ':heart_eyes:',
        ':kissing_heart:',
        ':flushed:',
        ':wink:',
        ':sleeping:',
        ':worried:',
        ':confused:',
        ':unamused:',
        ':scream:',
        ':astonished:',
        ':thumbsup:',
        ':thumbsdown:',
        ':broken_heart:',
        ':warning:',
        ':anchor:',
        ':rocket:',
        ':heart:'
    ];

    constructor(public dialogRef: MatDialogRef<DialogEmojiList>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }

    selectEmoji(emoji: string) {
        this.sel_emoji = emoji;
    }

    sendEmoji(emoji: string) {
        this.dialogRef.close(emoji);
    }
}
