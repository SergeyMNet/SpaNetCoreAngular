import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export interface IChatService {

    newMessageInRoom$: Subject<string>;
    messages$: Subject<Message[]>;

    addMessage(message: Message): void;

    getAvatars(user_id: string): Observable<Array<Avatar>>;
    addAvatar(avatar: Avatar);
    removeAvatar(avatar: Avatar);

    getRooms(): Observable<Array<string>>;
    subscribeToChat(chat_url: string);
    selectRoom(chat_url: string);
}
