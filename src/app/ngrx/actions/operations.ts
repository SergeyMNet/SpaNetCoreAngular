import { Action } from '@ngrx/store';
import { ChatRoom } from '../../core/home/chat.models';


export const ActionTypes = {
  ADD_ROOM: 'Add new chat room',
  REMOVE_ROOM: 'Remove chat room',
  ADD_AVATAR_TO_ROOM: 'Add avatar to room',
  REMOVE_AVATAR_FROM_ROOM: 'Add avatar to room',
  ADD_MESSAGE: 'Add new message',
};




export class AddRoomOperationAction implements Action {
  type = ActionTypes.ADD_ROOM;
  constructor(public payload: ChatRoom) { }
}

export class RemoveRoomOperationAction implements Action {
  type = ActionTypes.REMOVE_ROOM;
  constructor(public payload: ChatRoom) { }
}

export class AddAvatarToRoomOperationAction implements Action {
  type = ActionTypes.ADD_AVATAR_TO_ROOM;
  constructor(public payload: ChatRoom) { }
}

export class RemoveAvatarFromRoomOperationAction implements Action {
  type = ActionTypes.REMOVE_AVATAR_FROM_ROOM;
  constructor(public payload: ChatRoom) { }
}

export class AddMessageOperationAction implements Action {
  type = ActionTypes.ADD_MESSAGE;
  constructor(public payload: ChatRoom) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions
  = AddRoomOperationAction |
  RemoveRoomOperationAction |
  AddAvatarToRoomOperationAction |
  RemoveAvatarFromRoomOperationAction |
  AddMessageOperationAction;
