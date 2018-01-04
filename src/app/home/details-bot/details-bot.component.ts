import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-details-bot',
    templateUrl: 'details-bot.component.html',
    styleUrls: ['details-bot.component.scss']
})
export class DetailsBotComponent {

    @Input() curent_user_name = 'Me';
    @Input() curent_user_img = 'Me';

    @Output() kill: EventEmitter<any> = new EventEmitter();
}
