import { IChatService } from './ichat.interface';
import { ChatService } from './chat.service';
import { LocalChatService } from './local-chat.service';

export {
    ChatService,
    LocalChatService
};

export default [
    ChatService,
    LocalChatService
];
