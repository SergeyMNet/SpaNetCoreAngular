import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

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
        .switchMap(() => this.fcs.getChatsNames())
        .map(chats => this.adminActions.loadChatsSuccess(chats));


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
