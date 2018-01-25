import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import {  } from 'rxjs/Observable';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/zip';
import { Subscriber } from 'rxjs/Subscriber';
import { Observer } from 'firebase';
import { ChatModel } from '../admin.models';



const files_url = '/images/';
const chat_rooms_url = '/chat_rooms/';
const users_url = '/users/';

@Injectable()
export class FireChatService {
    constructor(
        private http: Http,
        private database: AngularFireDatabase) {
    }

    // get Chats names and Messages count
    public getChatsWithMessages(): Observable<Array<ChatModel>> {
        return this.getChatsNames()
            .switchMap(names => this.getCountMessages(names));
    }
    private getChatsNames(): Observable<string[]> {
        return this.database.object(chat_rooms_url)
            .valueChanges().map(resp => {
                return Object.keys(resp); });
    }
    private getCountMessages(names: string[]): Observable<Array<ChatModel>> {
        const all = [];
        names.forEach(url => {
            all.push(this.getMessagesCount(url));
        });
        return Observable.zip(...all);
    }
    private getMessagesCount(chat_url: string): Observable<ChatModel> {
        console.log('getMessagesCount ' + chat_url);
        return this.database.list<any>(chat_rooms_url + chat_url)
            .valueChanges().map((resp) => {
                return new ChatModel(chat_url, resp.length);
            });
    }



    // todo: add server method Edit Chat
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

