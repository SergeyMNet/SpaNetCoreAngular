import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth';

@Component({
  selector: 'app-root',
  template: `
    <app-header
      [user_name]="auth.user_name$ | async"
      [authenticated]="auth.authenticated$ | async"
      (signOut)="logout()"></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) {
  }

  logout() {
    this.auth.signOut();
    this.router.navigate(['/login']);
  }
}


