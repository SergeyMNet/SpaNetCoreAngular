import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { LoginComponent } from './components/login/login.component';

// modules
import { CustomMaterialModule } from '../material.module';
import { AuthRoutesModule } from './auth.routes';

// services
import { RequireAuthGuard, RequireUnauthGuard } from './guards';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutesModule,
    CustomMaterialModule
  ],
  providers: [
    AuthService,
    RequireAuthGuard,
    RequireUnauthGuard
  ]
})
export class AuthModule { }
