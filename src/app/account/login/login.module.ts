// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// This Module's Components
import { LoginComponent } from './login.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        LoginComponent,
    ],
    exports: [
        LoginComponent,
    ]
})
export class LoginModule {

}
