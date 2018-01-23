import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const files_url = '/images/';
const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';

@Injectable()
export class FireChatService {
    constructor(
        private http: Http,
        private database: AngularFireDatabase) {
    }

    public getChatsNames(): Observable<any[]> {
        return this.database.object(chat_rooms_url)
            .valueChanges().map(resp => {
                return Object.keys(resp);
            });
    }

    public getMessagesCount(chat_url: string): Observable<number> {
        return this.database.list<any>(chat_rooms_url + chat_url)
            .valueChanges().map(
            (resp) => {
                return resp.length;
            });
    }


    public editChat(chat: any): boolean {
        return true;
    }
    public deleteChat(chat: string): Promise<any> {
        console.log('service remove ' + chat);
        return this.database.list<any>(chat_rooms_url + chat).remove();
    }
}

