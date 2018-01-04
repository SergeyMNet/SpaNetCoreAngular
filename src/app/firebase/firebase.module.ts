import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../../environments/environment';

export const firebaseConfig = {
    apiKey: 'AIzaSyACBslO6f4CubvwnzqjiZhTQK8hKxJImS4',
    authDomain: 'alice-1d9df.firebaseapp.com',
    databaseURL: 'https://alice-1d9df.firebaseio.com',
    storageBucket: 'alice-1d9df.appspot.com',
    messagingSenderId: '799235809725'
  };

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ]
})
export class FirebaseModule { }
