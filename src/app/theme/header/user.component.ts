import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService, SettingsService, TokenService } from '@core';
import { AuthService } from '@shared/authentication/auth.service';
import { Guest, User } from '@shared/authentication/user';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  template: `
    <button
      mat-button
      class="matero-toolbar-button matero-avatar-button"
      href="javascript:void(0)"
      [matMenuTriggerFor]="menu"
    >
      <img class="matero-avatar" src="{{ user.avatar }}" width="32" alt="avatar" />
      <span class="matero-username" fxHide.lt-sm>{{ user.name }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ 'user.profile' | translate }}</span>
      </button>
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{ 'user.settings' | translate }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>{{ 'user.logout' | translate }}</span>
      </button>
    </mat-menu>
  `,
})
export class UserComponent implements OnInit, OnDestroy {
  user: User = new Guest();
  private subscription: Subscription;

  constructor(
    private _router: Router,
    private _settings: SettingsService,
    private _token: TokenService,
    private _menu: MenuService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscription = this.authService
      .user()
      .pipe(tap(user => (this.user = user)))
      .subscribe(_ => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout().subscribe(_ => {
      this._token.clear();
      this._settings.removeUser();
      this._menu.reset();
      this._router.navigateByUrl('/auth/login');
    });
  }
}
