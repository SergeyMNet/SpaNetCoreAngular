import { Component } from '@angular/core';

@Component({
    selector: 'app-friends-list',
    templateUrl: 'friends-list.component.html',
    styleUrls: ['friends-list.component.scss']
})
export class FriendsListComponent {

    list_friends = [
        'Veronika', 'Samanta', 'Amanda', 'Francesca', 'Roberta'
    ];
    sel_friend = '';

    selFriend(friend: string) {
        console.log(friend);
        this.sel_friend = friend;
    }
}
