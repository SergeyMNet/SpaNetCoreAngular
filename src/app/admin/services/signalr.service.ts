import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HubConnection } from '@aspnet/signalr-client';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChatModel } from '../admin.models';

const hub_url = 'http://localhost:5300/test';
// const event_name = 'sendToAll';
const event_name = 'getRandomData';



@Injectable()
export class SignalrService {

    private _hubConnection: HubConnection;
    public messages$: Subject<any> = new Subject<any>();
    public testData$: Subject<any> = new Subject<any>();

    public init() {
        this.openConnection();
        this.subscribeTo();
    }

    private openConnection() {
        this._hubConnection = new HubConnection(hub_url);
        this._hubConnection
          .start()
          .then(() => console.log('Connection started!'))
          .catch(err => console.error('Error while establishing connection :('));

    }

    private subscribeTo(to: string = event_name) {
        this._hubConnection.on(to, resp => {
            this.messages$.next(resp);
        });
    }

    public startRandom() {
        this._hubConnection
          .invoke(event_name)
          .catch(err => console.error(err));
    }

    public sendMessage(name: string, message: string, to: string = event_name): void {
        this._hubConnection
          .invoke(to, name, message)
          .catch(err => console.error(err));
    }
}

