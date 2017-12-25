
export class Avatar {
    name: string;
    img: string;
}

export class Message {
    id: string;
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
    text: string;
}

export class Room {
    id: string;
    name: string;
    url: string;
}
