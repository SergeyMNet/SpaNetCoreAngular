import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import {  } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/toPromise';


const files_url = '/images/';
const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';

@Injectable()
export class FireChatService {
    constructor(
        private http: Http,
        private database: AngularFireDatabase) {
    }

    public getChats(): Observable<any[]> {

        return new Observable(o => {
            this.getChatsNames().subscribe(names => {
                const all = [];
                names.forEach(url => {

                    this.getMessagesCount(url).subscribe(resp => {
                        all.push({
                            chat_name: url,
                            messages_count: resp
                        });
                        o.next(all);
                    });
                });
                o.next(all);
        });
    });
    }

    public getChatsNames(): Observable<any[]> {
        return this.database.object(chat_rooms_url)
            .valueChanges().map(resp => {
                return Object.keys(resp); });
    }

    public getMessagesCount(chat_url: string): Observable<number> {
        console.log('getMessagesCount ' + chat_url);
        return this.database.list<any>(chat_rooms_url + chat_url)
            .valueChanges().map((resp) => {
                return resp.length; });
    }

    public getAllMessagesCount(chat_urls: string[]): Observable<any> {
        return new Observable(o => {
            const all = [];
            chat_urls.forEach(url => {
            console.log('start ' + url);
            this.getMessagesCount(url).subscribe(resp => {
                    all.push(resp);
                    // all.push({
                    //     chat_name: url,
                    //     message_count: resp
                    // });
                });
            });
            console.log(all);
        o.next(all);
        });
    }


    public editChat(chat: any): Promise<any> {
        console.log('service edit');
        console.log(chat.payload.new);
        console.log(chat.payload.old);

        return null;
    }

    public deleteChat(chat: any): Promise<any> {
        console.log('service remove ' + chat);
        return this.database.list<any>(chat_rooms_url + chat).remove();
    }
}

