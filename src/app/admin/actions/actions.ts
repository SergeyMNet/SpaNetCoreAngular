import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';



@Injectable()
export class AdminActions {

    static LOAD_CHATS = '[Chat] Load Chats';
    static LOAD_CHATS_SUCCESS = '[Chat] Load Chats Success';

    static LOAD_MESSAGES_COUNT = '[Chat] Load Messages Count';
    static LOAD_MESSAGES_COUNT_SUCCESS = '[Chat] Load Messages Count Success';



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



    loadMessagesCount() {
        return {
            type: AdminActions.LOAD_MESSAGES_COUNT
        };
    }

    loadMessagesCountSuccess(MessagesCount: any) {
        return {
            type: AdminActions.LOAD_MESSAGES_COUNT_SUCCESS,
            payload: MessagesCount
        };
    }
}
