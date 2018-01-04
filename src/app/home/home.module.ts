// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// components
import { HomeComponent } from './home.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { DetailsBotComponent } from './details-bot/details-bot.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { DialogOverviewExampleDialog } from './rooms-list/rooms-list.component';
import { DialogAddAvatar } from './home.component';

// modules
import { CustomMaterialModule } from '../material.module';
import { HomeRoutesModule } from './home.routes';

// services
import { ChatService } from './services/chat.service';


@NgModule({
    imports: [
        BrowserModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HomeRoutesModule
    ],
    declarations: [
        HomeComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent,
        RoomsListComponent,
        DialogOverviewExampleDialog,
        DialogAddAvatar
    ],
    exports: [
        HomeComponent,
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
