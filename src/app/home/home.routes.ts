import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

// components
import { HomeComponent } from './home.component';

// guards
import { RequireAuthGuard } from '../auth';


export const HomeRoutesModule: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'chat',
    component: HomeComponent,
    canActivate: [RequireAuthGuard]
  },
  { path : '', redirectTo : 'chat', pathMatch: 'full'},
  { path : '**', redirectTo : 'chat'}
]);
