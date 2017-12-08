// Angular Imports
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from '../../material.module';

// This Module's Components
import { HomeComponent } from './home.component';
import { HeaderComponent } from '../header/header.component';

@NgModule({
    imports: [
        CustomMaterialModule
    ],
    declarations: [
        HomeComponent,
        HeaderComponent
    ],
    exports: [
        HomeComponent,
        HeaderComponent
    ]
})
export class HomeModule {
}
