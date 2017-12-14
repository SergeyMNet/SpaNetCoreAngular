import { Component } from '@angular/core';
import { names_list } from './names';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    names = names_list;
    bot_list = [];

    constructor() {
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
}
