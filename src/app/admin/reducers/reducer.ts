import { AdminActions } from '../actions';
import { ChatModel } from '../admin.models';

export type ChatsState =
    {
        all_chats: ChatModel[]
        chats: ChatModel[],
        old: any
    };


const initialState: ChatsState = {
    all_chats: [],
    chats: [],
    old: null
};

export default function (state = initialState, {type, payload}): ChatsState {
    switch (type) {
        case AdminActions.LOAD_CHATS_SUCCESS: {
            return {
                all_chats: payload,
                chats: payload,
                old: null
            };
        }
        case AdminActions.EDIT_CHAT_SUCCESS: {
            return {
                all_chats: state.all_chats.map(chat => {
                    return chat === payload.payload.old ? payload.payload.new : chat;
                  }),
                chats: state.chats.map(chat => {
                    return chat === payload.payload.old ? payload.payload.new : chat;
                  }),
                old: payload.payload
            };
        }
        case AdminActions.DELETE_CHAT_SUCCESS: {
            return {
                all_chats: state.all_chats.filter(chat => {
                    return chat !== payload.payload;
                  }),
                chats: state.chats.filter(chat => {
                    return chat !== payload.payload;
                  }),
                old: payload.payload
            };
        }
        case AdminActions.UNDO_DEL_CHAT: {
            return {
                all_chats: [...state.all_chats, state.old],
                chats: [...state.chats, state.old],
                old: null
            };
        }
        case AdminActions.UNDO_EDIT_CHAT: {
            return {
                all_chats: state.all_chats.map(chat => {
                    return chat === state.old.new ? state.old.old : chat;
                  }),
                chats: state.chats.map(chat => {
                    return chat === state.old.new ? state.old.old : chat;
                  }),
                old: null
            };
        }
        case AdminActions.FILTER_CHAT: {
            return {
                all_chats: state.all_chats,
                chats: state.all_chats.filter(chat => {
                    return (chat.id as string).startsWith(payload);
                  }),
                old: null
            };
        }
        case AdminActions.UNDO_FILTER_CHAT: {
            return {
                all_chats: state.all_chats,
                chats: state.all_chats,
                old: null
            };
        }
        default: {
            return state;
        }
    }
}
