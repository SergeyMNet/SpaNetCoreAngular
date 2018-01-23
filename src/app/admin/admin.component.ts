import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import { AppState } from './reducers';
import { AdminActions } from './actions';

import { FireChatService } from './services/fire.service';
import { Subject } from 'rxjs/Subject';
import { fail } from 'assert';
import { Subscription } from 'rxjs/Subscription';


@Component({
    moduleId: module.id,
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

    // Pie
    public pieChartType = 'doughnut';
    chats_names$: Observable<any[]>;
    chats_names: string[] = [];
    chats_counts: number[] = [];
    chats: ChatStat[] = [];
    public pieChartData = [300, 500];
    isReady = false;


    private sub_chat: Subscription;

    constructor(private store: Store<any>,
        private adminActions: AdminActions,
        public fcs: FireChatService) {
        this.chats_names$ = this.store.select(s => s.reducer.chats);
    }

    ngOnInit() {
        // ngrx
        this.store.dispatch(this.adminActions.loadChats());

        // subscribe to firebase
        this.sub_chat = this.fcs.getChatsNames().subscribe(r => {
            this.isReady = r.length === this.chats.length;
            this.chats = [];
            r.forEach(url => {
                const ch = new ChatStat();
                ch.name = url;
                this.fcs.getMessagesCount(url).subscribe(count => {
                    ch.count = count;
                    if (url === this.chats[r.length - 1].name) {
                        this.showChart();
                    }
                });
                this.chats.push(ch);
            });
        });
    }

    private showChart() {
        this.chats_names = this.chats.map(ch => ch.name);
        this.chats_counts = this.chats.map(ch => ch.count);
        this.isReady = true;
    }

    public chartClicked(e: any): void {
        console.log(e);
      }

    public chartHovered(e: any): void {
        console.log(e);
    }

    public editChat(chat: string) {
        this.store.dispatch(this.adminActions.deleteChat(chat));
    }
    public delChat(chat: string) {
        console.log(chat);
        this.store.dispatch(this.adminActions.deleteChat(chat));
    }

    ngOnDestroy() {
        this.sub_chat.unsubscribe();
    }
}

export class ChatStat {
    name: string;
    count: number;
}
