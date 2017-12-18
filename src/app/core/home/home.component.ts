import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { names_list, images_list } from './names';
import { Avatar } from './chat.models';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    names = names_list;
    images = images_list;
    bot_list = [];

    constructor(public dialog: MatDialog) {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        const av = new Avatar;
        av.name = new_name;
        av.img = img_name;
        this.bot_list.unshift(av);
    }

    openDialogAddAvatar(): void {
        const new_name = this.names[Math.floor(Math.random() * this.names.length)];
        const img_name = this.images[Math.floor(Math.random() * this.images.length)];
        console.log(new_name);
        const dialogRef = this.dialog.open(DialogAddAvatar, {
          width: '250px',
          data: { new_name: new_name, img: img_name }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.addAvatar(new_name, img_name);
        });
    }

    addAvatar(name: string, img_name: string) {
        console.log('add avatar');
        const av = new Avatar;
        av.name = name;
        av.img = img_name;
        this.bot_list.unshift(av);
    }

    kill(key: string) {
        console.log('kill avatar = ' + key);
        const index = this.bot_list.indexOf(key, 0);
        if (index > -1) {
            this.bot_list.splice(index, 1);
        }
    }
}

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

