import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog-add-avatar',
    styleUrls: ['home.component.scss'],
    templateUrl: 'dialog-add-avatar.html',
})
export class DialogAddAvatar {

    constructor(public dialogRef: MatDialogRef<DialogAddAvatar>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}

