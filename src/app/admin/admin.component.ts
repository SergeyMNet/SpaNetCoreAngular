import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput, MatSnackBar } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';

import { AppState } from './reducers';
import { AdminActions } from './actions';

import { FireChatService } from './services/fire.service';
import { Subject } from 'rxjs/Subject';
import { fail } from 'assert';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { DialogEditRoom } from './dialogEditRoom';
import { map } from 'rxjs/operator/map';

@Component({
    moduleId: module.id,
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

    // Pie Chart
    pieChartType = 'doughnut';
    chats_names$: Observable<any[]>;
    chats_counts: number[] = [];
    isReady = false;

    private searchTerms = new Subject<string>();
    private subs_chat: Subscription[] = [];

    constructor(private store: Store<{reducer: AppState}>,
        private adminActions: AdminActions,
        private dialog: MatDialog,
        private undoSnackBar: MatSnackBar,
        private fcs: FireChatService) {
        this.chats_names$ = this.store.select(s => s.reducer.admin_chats.chats);
    }

    ngOnInit() {
        // ngrx
        this.store.dispatch(this.adminActions.loadChats());

        // get count chat messages
        this.subs_chat.push(this.store.select(s => s.reducer.admin_chats.chats).subscribe(r => {
            this.isReady = false;
            this.chats_counts = [];
            r.forEach(url => {
                this.subs_chat.push(this.fcs.getMessagesCount(url).subscribe(count => {
                    this.chats_counts.push(count);
                    this.isReady = this.chats_counts.length === r.length;
                }));
            });
        }));

        // use search pipe
        this.subs_chat.push(this.searchTerms.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe(s => {
                if (s.length === 0) {
                    this.store.dispatch(this.adminActions.undoFilterChat());
                } else {
                    this.store.dispatch(this.adminActions.filterChat(s));
                }
           }));
    }

    public search(s: string) {
        this.searchTerms.next(s);
    }

    public editChat(chat: string) {
        const dialogRef = this.dialog.open(DialogEditRoom, {
            width: '250px',
            data: chat
        });

        this.subs_chat.push(dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                this.store.dispatch(this.adminActions.editChat({old: chat, new: result}));
                this.showSnack('Chat has edited!', this.adminActions.undoEditChat());
            }
        }));
    }

    public delChat(chat: string) {
        this.store.dispatch(this.adminActions.deleteChat(chat));
        this.showSnack('Chat has deleted!', this.adminActions.undoDelChat());
    }

    private showSnack(message: string, action: any) {
        const snack = this.undoSnackBar.open(message, 'Undo', { duration: 5000, horizontalPosition: 'center' });
        this.subs_chat.push(snack.afterDismissed().subscribe(() => {

        }));
        this.subs_chat.push(snack.onAction().subscribe(() => {
            this.store.dispatch(action);
        }));
    }

    ngOnDestroy() {
        this.subs_chat.forEach(s => { s.unsubscribe(); });
    }
}
