// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from '../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// This Module's Components
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { DetailsBotComponent } from './details-bot/details-bot.component';
import { FriendsListComponent } from './friends-list/friends-list.component';


@NgModule({
    imports: [
        BrowserModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        HomeComponent,
        HeaderComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent
    ],
    exports: [
        HomeComponent,
        HeaderComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent
    ]
})
export class HomeModule {
}
