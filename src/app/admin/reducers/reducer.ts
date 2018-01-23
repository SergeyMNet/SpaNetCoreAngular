import { AdminActions } from '../actions';


export type ChatsListState = any[];

const initialState: ChatsListState = [];

export default function (state = initialState, {type, payload}): ChatsListState {
    switch (type) {
        case AdminActions.LOAD_CHATS_SUCCESS: {
            return payload;
        }
        case AdminActions.EDIT_CHAT_SUCCESS: {
            console.log('EDIT_CHAT_SUCCESS');
            console.log(payload);
            return state.map(chat => {
                return chat === payload.old ? payload.new : chat;
              });
        }
        case AdminActions.DELETE_CHAT_SUCCESS: {
            console.log('DELETE_CHAT_SUCCESS');
            console.log(payload);
            return state.filter(chat => {
                return chat !== payload;
            });
        }
        default: {
            return state;
        }
    }
}
