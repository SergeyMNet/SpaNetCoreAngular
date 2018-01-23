import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';



@Injectable()
export class AdminActions {

    static LOAD_CHATS = '[Chat] Load Chats';
    static LOAD_CHATS_SUCCESS = '[Chat] Load Chats Success';

    static EDIT_CHAT = '[Chat] Edit Chats';
    static EDIT_CHAT_SUCCESS = '[Chat] Edit Chats Success';

    static DELETE_CHAT = '[Chat] Delete Chats';
    static  DELETE_CHAT_SUCCESS = '[Chat] Delete Chats Success';


    loadChats() {
        return {
            type: AdminActions.LOAD_CHATS
        };
    }

    loadChatsSuccess(Chats: any) {
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
}
