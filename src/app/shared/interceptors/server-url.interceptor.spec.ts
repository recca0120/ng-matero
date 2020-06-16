import { HttpClient, HttpParams, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@env/environment';
import { ServerUrlInterceptor } from './server-url.interceptor';

describe('ServerUrlInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: HTTP_INTERCEPTORS, useClass: ServerUrlInterceptor, multi: true }],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function shouldBe(uri: string, match: string) {
    http
      .post(uri, '', { params: new HttpParams({ fromObject: {} }) })
      .subscribe(response => expect(response).toBeTruthy());

    httpMock.expectOne(match).flush({});
  }

  it('should prepend server url and api endpoint', () => {
    shouldBe('/data', `${environment.SERVER_URL}${environment.API_ENDPOINT}/data`);
  });

  it('should prepend server url when sanctum cookie', () => {
    shouldBe('/sanctum/csrf-cookie', `${environment.SERVER_URL}/sanctum/csrf-cookie`);
  });

  it('should not prepend server url', () => {
    shouldBe('https://example.com/data', 'https://example.com/data');
  });
});
