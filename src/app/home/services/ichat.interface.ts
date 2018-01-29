import { Message, ChatRoom, Room, Avatar, Upload } from '../chat.models';
import { Subject } from 'rxjs/Subject';

export interface IChatService {

    avatars$: Subject<Avatar[]>;
    rooms_keys$: Subject<string[]>;
    newMessageInRoom$: Subject<string>;
    messages$: Subject<Message[]>;

    addMessage(message: Message);

    getAvatars(user_id: string);
    addAvatar(avatar: Avatar);
    removeAvatar(avatar: Avatar);

    getRooms();
    subscribeToChat(chat_url: string);
    selectRoom(chat_url: string);
}
