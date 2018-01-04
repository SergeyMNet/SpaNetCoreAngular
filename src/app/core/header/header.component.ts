import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {

    @Output()
    add_avatar: EventEmitter<any> = new EventEmitter();
}
