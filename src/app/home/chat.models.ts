import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from 'angular2-uuid';

const main_url = '/chat_rooms/';


export class AvatarApi {
    id: string;
    uid: string;
    name: string;
    img: string;
    sel_room = '/chat_rooms/main';
}


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
    photo: string;
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
    fromAvatarImg: string;
    toRoom: string;
    text: string;
    attach: string;
}

export class Room {
    id: string;
    name: string;
    url: string;
    hasNewMessage: boolean;

    constructor(name: string = '') {
        this.id = UUID.UUID();
        this.name = name;
        this.url = main_url + name;
    }
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
