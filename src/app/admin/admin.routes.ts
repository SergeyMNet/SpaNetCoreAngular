import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

// components
import { AdminComponent } from './admin.component';

// guards
import { RequireAuthGuard } from '../auth';


export const AdminRoutesModule: ModuleWithProviders = RouterModule.forChild([
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RequireAuthGuard]
  }
]);
