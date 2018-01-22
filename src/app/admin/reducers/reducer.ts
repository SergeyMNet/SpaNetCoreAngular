import { AdminActions } from '../actions';


export type ChatsListState = any[];

const initialState: ChatsListState = [];

export default function (state = initialState, {type, payload}): ChatsListState {
    switch (type) {
        case AdminActions.LOAD_CHATS_SUCCESS: {
            console.log(payload);
            return payload;
        }
        default: {
            return state;
        }
    }
}
