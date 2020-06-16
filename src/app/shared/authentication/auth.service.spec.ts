import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { DummyStorageService, LocalStorageService } from './storage.service';
import { Token, TokenService } from './token.service';
import { GenericUser, Guest } from './user';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocalStorageService, useClass: DummyStorageService }],
    });

    httpMock = TestBed.inject(HttpTestingController);

    service = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => httpMock.verify());

  it('should be false when user is not login', () => {
    expect(service.check()).toBeFalsy();
  });

  it('should login by username and password', () => {
    service.login('foo', 'bar').subscribe(isAuthenticated => expect(isAuthenticated).toBeTruthy());

    httpMock.expectOne('/auth/login').flush({ access_token: 'token', token_type: 'bearer' });
    httpMock.expectOne('/profile').flush({});

    expect(service.check()).toBeTruthy();
  });

  it('should be logout', () => {
    tokenService.set(new Token({ access_token: 'token', token_type: 'bearer' }));

    service.logout().subscribe(logout => expect(logout).toBeTruthy());

    httpMock.expectOne('/profile').flush({});
    httpMock.expectOne('/auth/logout').flush({});

    expect(service.check()).toBeFalsy();
  });

  it('should get user', () => {
    const attrs = {
      id: 1,
      name: 'foo',
      email: 'foo@bar.com',
      email_verified_at: '2019-12-18T10:44:13.000000Z',
      created_at: '2019-12-18T10:44:13.000000Z',
      updated_at: '2019-12-18T10:44:13.000000Z',
    };

    service
      .user()
      .pipe(filter(user => !(user instanceof Guest)))
      .subscribe(user => expect(user).toEqual(new GenericUser(attrs)));

    service.login('foo', 'bar').subscribe();

    httpMock.expectOne('/auth/login').flush({ access_token: 'token', token_type: 'bearer' });
    httpMock.expectOne('/profile').flush(attrs);
  });
});
