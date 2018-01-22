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

    @Effect() loadChats$ = this.update$
        .ofType(AdminActions.LOAD_CHATS)
        .switchMap(() => this.fcs.getChatsNames())
        .map(chats => this.adminActions.loadChatsSuccess(chats));

    @Effect() loadMessagesCount$ = this.update$
        .ofType(AdminActions.LOAD_MESSAGES_COUNT)
        .map(action => action.payload)
        .switchMap(messages => this.fcs.getMessages(messages))
        .map(messages => this.adminActions.loadMessagesCountSuccess(messages));
}
