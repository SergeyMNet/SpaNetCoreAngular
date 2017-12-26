import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CustomMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
// for AngularFireAuth
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

// ngrx
import { StoreModule } from '@ngrx/store';
import { chatReducer } from './ngrx/reducer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './account/login/login.module';
import { HomeModule } from './core/home/home.module';

export const firebaseConfig = {
  apiKey: 'AIzaSyACBslO6f4CubvwnzqjiZhTQK8hKxJImS4',
  authDomain: 'alice-1d9df.firebaseapp.com',
  databaseURL: 'https://alice-1d9df.firebaseio.com',
  // projectId: 'alice-1d9df',
  storageBucket: 'alice-1d9df.appspot.com',
  messagingSenderId: '799235809725'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CustomMaterialModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    // StoreModule.provideStore(chatReducer),
    StoreModule.forRoot(chatReducer),
    LoginModule,
    HomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
