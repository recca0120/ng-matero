import { HttpClient, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DummyStorageService, LocalStorageService } from '@shared';
import { Token, TokenService } from '@shared/services/token.service';
import { TokenInterceptor } from './token.interceptor';

describe('TokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let req: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LocalStorageService, useClass: DummyStorageService },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should append authorization header', () => {
    const tokenService = TestBed.inject(TokenService);
    tokenService.set(new Token({ access_token: 'token', token_type: 'Bearer' }));

    http.get('/').subscribe();

    req = httpMock.expectOne('/');
    req.flush({});

    expect(req.request.headers.get('Authorization')).toEqual(`Bearer token`);
  });

  it('should not append authorization header when not login', () => {
    http.get('/').subscribe();

    req = httpMock.expectOne('/');
    req.flush({});

    expect(req.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should append original authorization header', () => {
    http.get('/', { headers: new HttpHeaders({ Authorization: 'foo' }) }).subscribe();

    req = httpMock.expectOne('/');
    req.flush({});

    expect(req.request.headers.get('Authorization')).toEqual('foo');
  });
});
