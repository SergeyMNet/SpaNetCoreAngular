import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../auth.service';


@Injectable()
export class RequireUnauthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.authenticated$
      .take(1)
      .do(authenticated => {
        if (authenticated) {
          this.router.navigate(['/chat']);
        }
      })
      .map(authenticated => !authenticated);
  }
}
