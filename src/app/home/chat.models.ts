import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { UUID } from 'angular2-uuid';

const main_url = '/chat_rooms/';

export class Avatar {
    id: string;
    uid: string;
    name: string;
    img: string;
    create_date: number;
    sel_room = '/chat_rooms/main';
    rooms: Room[] = [];
}

export class Message {
    id: string = UUID.UUID();
    room_id: string;
    from: string;
    photo: string;
    date_utc_string: string;
    time: Date;
    text: string;
    attach: string;
    attachFile: Upload;
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

export class Upload {
    $key: string;
    file: File;
    name: string;
    url: string;
    progress: number;
    createdAt: Date = new Date();

    constructor(file: File) {
      this.file = file;
    }
}
