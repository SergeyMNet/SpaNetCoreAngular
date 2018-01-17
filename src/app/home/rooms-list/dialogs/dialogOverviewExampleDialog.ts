import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    selector: 'app-dialog-overview-example-dialog',
    templateUrl: 'dialog-add-room.html',
})

export class DialogOverviewExampleDialog {

    constructor(public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
}
