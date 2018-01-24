// Angular Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// charts
import { ChartsModule } from 'ng2-charts/ng2-charts';

// ngrx
import {Store, StoreModule} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// redux store
import reducer from './reducers';
import { AdminActions } from './actions';
import { FireChatService } from './services';
import { AdminEffects } from './effects';

// components
import { AdminComponent } from './admin.component';
import { DialogEditRoom } from './dialogEditRoom';

// modules
import { CustomMaterialModule } from '../material.module';
import { AdminRoutesModule } from './admin.routes';


@NgModule({
    imports: [
        BrowserModule,
        CustomMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        AdminRoutesModule,
        ChartsModule,
        StoreModule.forRoot({reducer}),
        EffectsModule.forRoot([AdminEffects]),
        StoreDevtoolsModule.instrument({ maxAge: 10 })
    ],
    declarations: [
        AdminComponent,
        DialogEditRoom
    ],
    exports: [
        AdminComponent,
    ],
    entryComponents: [
        DialogEditRoom
    ],
    providers: [
        FireChatService,
        AdminActions
    ]
})
export class AdminModule {

}
