import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { names_list } from './names';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    names = names_list;
    bot_list = [];

    constructor(public dialog: MatDialog) {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        this.bot_list.unshift(new_name);
    }

    addAvatar() {
        console.log('add avatar');
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        this.bot_list.unshift(new_name);
    }

    kill(key: string) {
        console.log('kill avatar = ' + key);
        const index = this.bot_list.indexOf(key, 0);
        if (index > -1) {
            this.bot_list.splice(index, 1);
        }
    }


    openDialogAddAvatar(): void {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        console.log(new_name);
        const dialogRef = this.dialog.open(DialogAddAvatar, {
          width: '250px',
          data: { new_name: new_name }
        });

        dialogRef.afterClosed().subscribe(result => {
            // this.saveRoom(result);
        });
    }
}

@Component({
    selector: 'app-dialog-add-avatar',
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

