import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';



@Injectable()
export class AdminActions {

    static LOAD_CHATS = '[Chat] Load Chats';
    static LOAD_CHATS_SUCCESS = '[Chat] Load Chats Success';

    static EDIT_CHAT = '[Chat] Edit Chats';
    static EDIT_CHAT_SUCCESS = '[Chat] Edit Chats Success';

    static DELETE_CHAT = '[Chat] Delete Chats';
    static DELETE_CHAT_SUCCESS = '[Chat] Delete Chats Success';

    static UNDO_DEL_CHAT = '[Chat] Undo del Chats';
    static UNDO_EDIT_CHAT = '[Chat] Undo edit Chats';

    static FILTER_CHAT = '[Chat] Filter Chats';
    static UNDO_FILTER_CHAT = '[Chat] Undo Filter Chats';

    loadChats() {
        return {
            type: AdminActions.LOAD_CHATS
        };
    }

    loadChatsSuccess(Chats: any[]) {
        console.log(Chats);
        return {
            type: AdminActions.LOAD_CHATS_SUCCESS,
            payload: Chats
        };
    }


    editChat(payload: any) {
        return {
            type: AdminActions.EDIT_CHAT,
            payload: payload
        };
    }

    editChatSuccess(payload: any) {
        return {
            type: AdminActions.EDIT_CHAT_SUCCESS,
            payload: payload
        };
    }


    deleteChat(Chat: any) {
        return {
            type: AdminActions.DELETE_CHAT,
            payload: Chat
        };
    }

    deleteChatSuccess(Chat: any) {
        return {
            type: AdminActions.DELETE_CHAT_SUCCESS,
            payload: Chat
        };
    }

    undoDelChat() {
        return {
            type: AdminActions.UNDO_DEL_CHAT,
            payload: null
        };
    }

    undoEditChat() {
        return {
            type: AdminActions.UNDO_EDIT_CHAT,
            payload: null
        };
    }

    filterChat(search_term: string) {
        console.log(search_term);
        return {
            type: AdminActions.FILTER_CHAT,
            payload: search_term
        };
    }

    undoFilterChat() {
        return {
            type: AdminActions.UNDO_FILTER_CHAT,
            payload: null
        };
    }

}
