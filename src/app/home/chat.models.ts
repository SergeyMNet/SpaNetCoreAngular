import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

export class Avatar {
    id: string;
    uid: string;
    name: string;
    img: string;
    sel_room = '/chat_rooms/main';
    rooms: Room[] = [];
}

export class Message {
    id: string;
    room_id: string;
    from: string;
    time: Date;
    text: string;
  }

export class MessageApi {
    attach: string;
    date_message: string;
    id: string;
    message: string;
    photo: string;
    username: string;
}

export class NewMessage {
    fromAvatar: string;
    toRoom: string;
    text: string;
}

export class Room {
    id: string;
    name: string;
    url: string;
    hasNewMessage: boolean;
}

export class ChatRoom {
    id: string;
    avatar: string;
    room: string;
    hasNewMessage: boolean;
    subscription: Subscription; // todo - unsubscribe
    messages$: Subject<Message[]>;
    messagesArray: Message[] = []; // todo - old messages - fix it
}
