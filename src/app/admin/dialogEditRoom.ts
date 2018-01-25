import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-dialog-edit-chat',
    template: `
        <div style="text-align: center;">
            <mat-input-container floatPlaceholder="auto"
                                 dividerColor="primary">
                <input matInput [(ngModel)]="data.chat_name"
                       type="text"
                       required
                       placeholder="Chat-room">
            </mat-input-container>
        </div>
        <div style="text-align: center;">
            <button mat-raised-button (click)="save()" color="primary">Save</button>
            <button mat-raised-button (click)="cancel()">Cancel</button>
        </div>`,
    styleUrls: ['./admin.component.scss'],
})

export class DialogEditRoom {

    constructor(public dialogRef: MatDialogRef<any>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    cancel() {
        this.dialogRef.close();
    }

    save() {
        this.dialogRef.close(this.data);
    }
}
