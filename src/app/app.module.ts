import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// modules
import { CustomMaterialModule } from './material.module';
import { FirebaseModule } from './firebase';
import { AuthModule } from './auth';
import { HomeModule } from './home/home.module';
import { AdminModule } from './admin/admin.module';

// components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';


@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    RouterModule.forRoot([], {useHash: false}),
    FirebaseModule,
    AdminModule,
    AuthModule,
    HomeModule,
  ]
})
export class AppModule { }
