import { UUID } from 'angular2-uuid';

export class ChatModel {
    id = UUID.UUID();
    chat_name: string;
    messages_count: number;

    constructor(name: string = '', messages_count = 0) {
        this.chat_name = name;
        this.messages_count = messages_count;
    }
}
