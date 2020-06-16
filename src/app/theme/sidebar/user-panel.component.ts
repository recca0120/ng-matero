import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@shared/authentication/auth.service';
import { Guest, User } from '@shared/authentication/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <img class="matero-user-panel-avatar" src="{{ user.avatar }}" alt="avatar" width="64" />
      <h4 class="matero-user-panel-name">{{ user.name }}</h4>
      <h5 class="matero-user-panel-email">{{ user.email }}</h5>
      <div class="matero-user-panel-icons">
        <a routerLink="/profile/overview" mat-icon-button>
          <mat-icon>account_circle</mat-icon>
        </a>
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon>settings</mat-icon>
        </a>
        <a routerLink="/auth/login" mat-icon-button>
          <mat-icon>exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
})
export class UserPanelComponent implements OnInit, OnDestroy {
  user: User = new Guest();
  private subscription: Subscription;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.subscription = this.authService.user().subscribe(user => (this.user = user));
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
