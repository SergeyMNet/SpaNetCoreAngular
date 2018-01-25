import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput, MatSnackBar } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operator/map';
import 'rxjs/add/operator/takeUntil';


import { AppState } from './reducers';
import { AdminActions } from './actions';
import { FireChatService } from './services/fire.service';
import { DialogEditRoom } from './dialogEditRoom';


import { ChatModel } from './admin.models';

@Component({
    selector: 'app-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

    // Pie Chart
    pieChartType = 'doughnut';
    chats$: Observable<ChatModel[]>;
    chats_names$: Observable<string[]>;
    chats_counts$: Observable<number[]>;
    isReady = false;

    private searchTerms = new Subject<string>();
    private ngUnsubscribe = new Subject();

    constructor(private store: Store<{reducer: AppState}>,
        private adminActions: AdminActions,
        private dialog: MatDialog,
        private undoSnackBar: MatSnackBar,
        private fcs: FireChatService) {
        this.chats$ = this.store.select(s => s.reducer.admin_chats.chats);
        this.chats_names$ = this.chats$.map(chats => chats.map(c => c.chat_name));
        this.chats_counts$ = this.chats$.map(chats => chats.map(c => c.messages_count));
    }

    ngOnInit() {
        // ngrx
        this.store.dispatch(this.adminActions.loadChats());

        // updating Chart
        this.chats$
            .map(res => { this.isReady = false; return res; })
            .map(res => { setTimeout(() => {this.isReady = res.length > 0; }, 500); })
            .subscribe();

        // use search pipe
        this.searchTerms.pipe(debounceTime(300), distinctUntilChanged()).takeUntil(this.ngUnsubscribe)
            .subscribe(s => { this.store.dispatch(this.adminActions.filterChat(s)); });
    }

    public search(s: string) {
        this.searchTerms.next(s);
    }

    public editChat(chat: ChatModel) {
        const dialogRef = this.dialog.open(DialogEditRoom, { width: '250px',
            data:  Object.assign({}, chat)
        });

        dialogRef.afterClosed().takeUntil(this.ngUnsubscribe).subscribe(result => {
            if (result !== undefined) {
                this.store.dispatch(this.adminActions.editChat({old: chat, new: result}));
                this.showSnack('Chat has edited!', this.adminActions.undoEditChat());
            }
        });
    }

    public delChat(chat: ChatModel) {
        this.store.dispatch(this.adminActions.deleteChat(chat));
        this.showSnack('Chat has deleted!', this.adminActions.undoDelChat());
    }

    private showSnack(message: string, action: any) {
        const snack = this.undoSnackBar.open(message, 'Undo', { duration: 5000, horizontalPosition: 'center' });
        snack.afterDismissed().takeUntil(this.ngUnsubscribe).subscribe(() => {});
        snack.onAction().takeUntil(this.ngUnsubscribe).subscribe(() => {
            this.store.dispatch(action);
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.unsubscribe();
    }
}
