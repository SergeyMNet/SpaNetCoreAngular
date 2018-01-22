import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { link } from 'fs';
import { Subject } from 'rxjs/Subject';

// import { Message } from '../../chat.models';


const files_url = '/images/';
const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';

@Injectable()
export class FireChatService {
    constructor (
        private http: Http,
        private database: AngularFireDatabase) {
    }

    public getChatsNames(): Observable<any[]> {
        return this.database.object(chat_rooms_url)
                .valueChanges().map(resp => {
                    return  Object.keys(resp);
        });
    }

    public getMessages(chat_url: string[]): Observable<any[]> {

        const list = [];
        chat_url.forEach(url => {
             this.database.list<any>(url)
                .valueChanges().map(
                (resp) => {
                    list.push(resp);
                    return resp.length;
                });
        });
        const result = new Subject<any[]>();
        result.next(list);
        return result;
    }
}
