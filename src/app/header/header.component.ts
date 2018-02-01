import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ChooseServerService } from '../_services';

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

    model = { server: 'Firebase' };
    services = [ 'Firebase', 'SignalR' ];

    constructor(private chooseServer: ChooseServerService) {
    }

    public onServiceChange() {
        console.log(this.model.server);
        this.chooseServer.server$.next(this.model.server.toLowerCase());
    }
}
