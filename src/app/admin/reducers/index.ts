import {compose} from '@ngrx/core/compose';
import {combineReducers} from '@ngrx/store';

import ChatsListState, * as fromReducer from './reducer';

export interface AppState {
    admin_chats: fromReducer.ChatsState;
}

export default compose(combineReducers)({
    admin_chats: ChatsListState
});
