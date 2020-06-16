import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingsService, StartupService, TokenService } from '@core';
import { AuthService } from '@shared/authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private subscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _token: TokenService,
    private _startup: StartupService,
    private _settings: SettingsService,
    private _auth: AuthService
  ) {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember_me: [],
    });
  }

  ngOnInit() {
    this.subscription = this._auth.user().subscribe(user => {
      // Set user info
      this._settings.setUser({ id: user.id, name: user.name, avatar: user.avatar });
      // Set token info
      this._token.set({ token: `${user.id}${user.name}`, uid: user.id, username: user.name });
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  login() {
    const { username, password, remember_me } = this.loginForm.value;

    this._auth.login(username, password, remember_me).subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        return;
      }

      // Regain the initial data
      this._startup.load().then(() => {
        let url = this._token.referrer!.url || '/';
        if (url.includes('/auth')) {
          url = '/';
        }
        this._router.navigateByUrl(url);
      });
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // login() {
  //   const { token, username, uid } = { token: 'ng-matero-token', uid: 1, username: 'ng-matero' };
  //   // Set user info
  //   this._settings.setUser({ id: uid, name: username, avatar: '' });
  //   // Set token info
  //   this._token.set({ token, uid, username });
  //   // Regain the initial data
  //   this._startup.load().then(() => {
  //     let url = this._token.referrer!.url || '/';
  //     if (url.includes('/auth')) {
  //       url = '/';
  //     }
  //     this._router.navigateByUrl(url);
  //   });
  // }
}
