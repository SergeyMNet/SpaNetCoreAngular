import { Observable } from 'rxjs/Observable';
import {
  combineReducers,
  ActionReducerMap,
  createSelector,
  createFeatureSelector,
  ActionReducer,
  MetaReducer, } from '@ngrx/store';
import { UUID } from 'angular2-uuid';

import { ChatRoom, Message, Avatar } from '../core/home/chat.models';
import * as operations from './actions/operations';
import { compose } from '@ngrx/store/src/utils';

export interface State {
  entities: Array<ChatRoom>;
}

const initialState: State = { entities: [] };

export function chatReducer(state = initialState, action: operations.Actions): State {
  switch (action.type) {

    case operations.ActionTypes.ADD_ROOM: {
      console.log('ADD ROOM');
      console.log(state);
      const room: ChatRoom = action.payload;
      room.id = UUID.UUID();
      return {
        entities: [...state.entities, room]
      };
    }

    case operations.ActionTypes.REMOVE_ROOM: {
      console.log('REMOVE ROOM');
      console.log(state);
      return { entities: state.entities.filter(item => item.id !== action.payload.id) };
    }

    case operations.ActionTypes.ADD_AVATAR_TO_ROOM: {
      // todo: add avatar to chat-room
      console.log('ADD AVATAR TO ROOM');
      console.log(state);
      return null;
    }

    case operations.ActionTypes.REMOVE_AVATAR_FROM_ROOM: {
      // todo: remove avatar from chat-room
      console.log('REMOVE AVATAR TO ROOM');
      console.log(state);
      return null;
    }

    case operations.ActionTypes.ADD_MESSAGE: {
      // todo: add message to chat
      console.log('ADD MESSAGE');
      console.log(state);
      return null;
    }

    // case operations.ActionTypes.ADD_OPERATION: {
    //   console.log(state);
    //   const counter: Message = action.payload;
    //   return {
    //     entities: [...state.entities, counter]
    //   };
    // }

    // case operations.ActionTypes.INCREMENT_OPERATION: {
    //   const counter = ++action.payload.amount;
    //   return Object.assign({}, state, {
    //     entities: state.entities.map(item => item.id === action.payload.id ? Object.assign({}, item, counter) : item)
    //   });
    // }

    // case operations.ActionTypes.DECREMENT_OPERATION: {
    //   if (action.payload.amount > 0)
    //     --action.payload.amount;
    //   const counter = action.payload.amount;
    //   return Object.assign({}, state, {
    //     entities: state.entities.map(item => item.id === action.payload.id ? Object.assign({}, item, counter) : item)
    //   });
    // }

    // case operations.ActionTypes.RESET_ALL_OPERATION: {
    //   state.entities.forEach(element => {
    //     element.amount = 0;
    //   });
    //   return Object.assign({}, state);
    // }

    // case operations.ActionTypes.RESET_OPERATION: {
    //   const counter = action.payload.amount = 0;
    //   return Object.assign({}, state, {
    //     entities: state.entities.map(item => item.id === action.payload.id ? Object.assign({}, item, counter) : item)
    //   });
    // }

    default:
      return state;
  }
}


// export function getEntities(state$: Observable<State>) {
//   return state$.select(s => s.entities);
// }
