import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Token, TokenService } from './token.service';
import { GenericUser, Guest } from './user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject(new Guest());

  constructor(private tokenService: TokenService, private http: HttpClient) {
    this.changed();
  }

  isAuthenticated() {
    return this.tokenService.changed().pipe(map(token => token.valid()));
  }

  check() {
    return this.tokenService.get().valid();
  }

  login(email: string, password: string, rememberMe = false): Observable<boolean> {
    return this.http
      .post<any>('/auth/login', { email, password, remember_me: rememberMe })
      .pipe(
        tap(token => this.tokenService.set(new Token(token))),
        map(_ => this.check())
      );
  }

  logout() {
    return this.check()
      ? this.http.post('/auth/logout', {}).pipe(
          tap(_ => this.tokenService.clear()),
          map(_ => !this.check())
        )
      : of(true);
  }

  user(): Observable<User> {
    return this.userSubject;
  }

  private changed() {
    this.tokenService
      .changed()
      .pipe(switchMap(_ => this.getUser()))
      .subscribe(user => this.userSubject.next(user));
  }

  private getUser() {
    return this.check()
      ? this.http.get('/profile').pipe(map(attrs => new GenericUser(attrs)))
      : of(new Guest());
  }
}
