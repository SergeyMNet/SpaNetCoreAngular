import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';


@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss']
})
export class LoginComponent {
    constructor(private auth: AuthService, private router: Router) {
    }

    signInAnonymously(): void {
        console.log('+');
        this.auth.signInAnonymously()
          .then(() => this.postSignIn());
    }

    signInWithFacebook(): void {
        this.auth.signInWithFacebook()
          .then(() => this.postSignIn());
    }

    signInWithGithub(): void {
        this.auth.signInWithGithub()
          .then(() => this.postSignIn());
    }

    signInWithGoogle(): void {
        this.auth.signInWithGoogle()
          .then(() => this.postSignIn());
    }

    signInWithTwitter(): void {
        this.auth.signInWithTwitter()
          .then(() => this.postSignIn());
    }

    private postSignIn(): void {
        this.router.navigate(['/chat']);
    }
}


