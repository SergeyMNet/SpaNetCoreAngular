import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ChatStore } from './interfaces';
import { UUID } from 'angular2-uuid';
import * as chat_models from '../home/chat.models';


const initialState: ChatStore = { rooms: []};

export const chatStore = (state = initialState, {type, payload}): ChatStore => {
  switch (type) {

    case 'ADD_ROOM': {
      console.log(type);
      const r = new chat_models.Room();
      r.name = payload;
      r.id = UUID.UUID();
      r.url = '/chat_rooms/' + payload;
      return {
        rooms: [...state.rooms, r]
      };
    }

    case 'ADD_MESSAGES': {
      console.log(type);
      console.log(payload);

      const messages = payload as chat_models.Message[];
      if (messages !== null && messages.length > 0) {
        const room_id = messages[0].room_id;
        state.rooms.forEach(room => {
          if (room.id === room_id) {
            // room.messages$.next(messages);
          }
        });
        return Object.assign({}, state, {
           rooms: state.rooms
        });
      } else {
        return state;
      }
    }

    default:
      return state;
  }
};

