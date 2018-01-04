import { Component } from '@angular/core';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent {

    user: Observable<firebase.User>;
    items: any[];
    msgVal = '';

    constructor(public afAuth: AngularFireAuth, public af: AngularFireDatabase) {

       af.list('/chats').valueChanges().subscribe(
          (resp) => {
            this.items = resp;
          }
      );
      this.user = this.afAuth.authState;

    }


    login() {
        this.afAuth.auth.signInAnonymously();
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    Send() {
        console.log('send');
        this.af.list('/chats').push(
            {
                attach: '',
                date_message: 636405346179656800,
                id: '',
                message: 'test message 1',
                photo: 'user',
                username: 'test-admin'
            });
    }
}


