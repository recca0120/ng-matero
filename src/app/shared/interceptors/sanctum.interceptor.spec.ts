import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SanctumInterceptor } from './sanctum.interceptor';

describe('SanctumInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let req: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: SanctumInterceptor, multi: true }],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function expectUrl(url: string) {
    req = httpMock.expectOne(url);
    req.flush({});

    expect(req.request.url).toEqual(url);
  }

  it('should touch csrf-cookie', () => {
    http.get('/test').subscribe();

    expectUrl('/sanctum/csrf-cookie');
    expectUrl('/test');
  });
});
