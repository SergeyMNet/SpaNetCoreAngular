import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.scss']
})
export class HeaderComponent {

    @Input() authenticated: boolean;
    @Input() user_name: string;
    @Output() signOut = new EventEmitter(false);
    @Output() admin = new EventEmitter();
}
