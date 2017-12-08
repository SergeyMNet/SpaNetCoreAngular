import { Component } from '@angular/core';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent {

    bot_list = [
        'Sam', 'Jack', 'Hillary', 'Johnny', 'Selena'
    ];
}
