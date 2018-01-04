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
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { DialogOverviewExampleDialog } from './rooms-list/rooms-list.component';
import { DialogAddAvatar } from './home.component';


// services
import { ChatService } from './services/chat.service';


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
        FriendsListComponent,
        RoomsListComponent,
        DialogOverviewExampleDialog,
        DialogAddAvatar
    ],
    exports: [
        HomeComponent,
        HeaderComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent,
        RoomsListComponent,
        DialogOverviewExampleDialog
    ],
    entryComponents: [
        DialogOverviewExampleDialog,
        DialogAddAvatar
     ],
    providers: [
        ChatService
    ]
})
export class HomeModule {
}
