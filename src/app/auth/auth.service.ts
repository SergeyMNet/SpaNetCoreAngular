import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '../firebase';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class AuthService {
  authenticated$: Observable<boolean>;
  uid$: Observable<string>;
  user_name$: Subject<string> = new Subject<string>();

  constructor(public afAuth: AngularFireAuth) {
    this.authenticated$ = afAuth.authState.map(user => !!user);
    this.uid$ = afAuth.authState.map(user => { if (user !== null) { return user.uid; } return ''; });
    this.afAuth.authState.subscribe((resp => {
      if (resp !== null) { this.user_name$.next(resp.displayName); }
    }));
  }

  signIn(provider: firebase.auth.AuthProvider)  {
    return this.afAuth.auth.signInWithPopup(provider)
      .catch(error => console.log('ERROR @ AuthService#signIn() :', error));
  }

  signInAnonymously() {
    return this.afAuth.auth.signInAnonymously()
      .catch(error => console.log('ERROR @ AuthService#signInAnonymously() :', error));
  }

  signInWithGithub() {
    return this.signIn(new firebase.auth.GithubAuthProvider());
  }

  signInWithGoogle() {
    return this.signIn(new firebase.auth.GoogleAuthProvider());
  }

  signInWithTwitter() {
    return this.signIn(new firebase.auth.TwitterAuthProvider());
  }

  signInWithFacebook() {
    return this.signIn(new firebase.auth.FacebookAuthProvider());
  }

  signOut(): void {
    this.afAuth.auth.signOut();
  }
}
