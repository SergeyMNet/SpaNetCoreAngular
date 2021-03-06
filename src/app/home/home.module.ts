// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import Emoji
import { Ng2EmojiModule } from 'ng2-emoji';

// components
import { HomeComponent } from './home.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { DetailsBotComponent } from './details-bot/details-bot.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { RoomsListComponent } from './rooms-list/rooms-list.component';
import { DialogOverviewExampleDialog } from './rooms-list/dialogs/dialogOverviewExampleDialog';
import { DialogAddAvatar } from './dialogAddAvatar';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DialogEmojiList } from './chat-room/dialogs/dialogEmojiList';

// modules
import { CustomMaterialModule } from '../material.module';
import { HomeRoutesModule } from './home.routes';

// services
import { ChatService, LocalChatService } from './services';



@NgModule({
    imports: [
        BrowserModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HomeRoutesModule,
        Ng2EmojiModule.forRoot()
    ],
    declarations: [
        HomeComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent,
        RoomsListComponent,
        DialogOverviewExampleDialog,
        DialogEmojiList,
        DialogAddAvatar
    ],
    exports: [
        HomeComponent,
        ChatRoomComponent,
        DetailsBotComponent,
        FriendsListComponent,
        RoomsListComponent,
    ],
    entryComponents: [
        DialogOverviewExampleDialog,
        DialogEmojiList,
        DialogAddAvatar
     ],
    providers: [
        ChatService,
        LocalChatService
    ]
})
export class HomeModule {
}
