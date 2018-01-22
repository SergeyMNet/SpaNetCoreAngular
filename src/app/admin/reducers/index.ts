import {compose} from '@ngrx/core/compose';
import {combineReducers} from '@ngrx/store';

import ChatsListState, * as fromReducer from './reducer';

export interface AppState {
    chats: fromReducer.ChatsListState;
}

export default compose(combineReducers)({
    chats: ChatsListState
});
