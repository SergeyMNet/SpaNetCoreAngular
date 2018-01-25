import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';

import { AppState } from '../reducers';
import { AdminActions } from '../actions';
import { FireChatService } from '../services';


@Injectable()
export class AdminEffects {
    constructor (
        private update$: Actions,
        private adminActions: AdminActions,
        private fcs: FireChatService,
    ) {}

    @Effect()
    loadChats$ = this.update$
        .ofType(AdminActions.LOAD_CHATS)
        .switchMap(() => this.fcs.getChatsWithMessages())
        .map(c => this.adminActions.loadChatsSuccess(c));


    @Effect()
    editChat$ = this.update$
        .ofType(AdminActions.EDIT_CHAT)
        // TODO: add api for edit chat
        .map(chat => this.adminActions.editChatSuccess(chat));

    @Effect()
    deleteChat$ = this.update$
        .ofType(AdminActions.DELETE_CHAT)
        // .switchMap(action => this.fcs.deleteChat(action))
        .map(chat => this.adminActions.deleteChatSuccess(chat));


}
