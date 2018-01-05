import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable, Subscribable } from 'rxjs/Observable';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

import { Avatar, Room } from '../chat.models';


@Injectable()
export class AvatarService{

    public avatars$: Subject<Avatar[]> = new Subject<Avatar[]>();

    constructor(public database: AngularFireDatabase) {
    }

    public getAvatars(uid: string) {
        this.database.list<Avatar>('/avatars/' + uid + '/')
            .valueChanges().subscribe(resp => {
                console.log(resp);
                const avatars = resp.map((item) => {
                    return <Avatar> {
                        id: item.id,
                        uid: item.uid,
                        name: item.name,
                        img: item.img,
                        sel_room: '/chat_rooms/main',
                        rooms: []
                    };
                });
                this.avatars$.next(avatars);
            });
    }

    public addAvatar(newAvatar: Avatar) {

        this.database.list('/avatars/' + newAvatar.uid + '/').push(
            {
                id: UUID.UUID(),      // id
                uid: newAvatar.uid,   // user id
                name: newAvatar.name, // avatar name
                img: newAvatar.img    // img url
            });
    }
}
