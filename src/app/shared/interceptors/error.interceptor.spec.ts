import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DummyStorageService, LocalStorageService } from '@shared';
import { TokenService } from '@shared/services/token.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorInterceptor, StatusCode } from './error.interceptor';

describe('ErrorInterceptor', () => {
  const router: any = { navigate: () => {} };
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: LocalStorageService, useClass: DummyStorageService },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);

    spyOn(router, 'navigate');
  });

  afterEach(() => {
    httpMock.verify();
  });

  function throwError(status: StatusCode | number, statusText: string) {
    http
      .get('/')
      .pipe(catchError(() => of([])))
      .subscribe();

    httpMock.expectOne('/').flush({}, { status, statusText });
  }

  it('should redirect when unauthorized', () => {
    const tokenService = TestBed.inject(TokenService);
    spyOn(tokenService, 'clear');

    throwError(StatusCode.UNAUTHORIZED, 'UNAUTHORIZED');

    expect(tokenService.clear).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      ['/auth/login'],
      Object({ skipLocationChange: true })
    );
  });

  it('should redirect when forbidden', () => {
    throwError(StatusCode.FORBIDDEN, 'FORBIDDEN');

    expect(router.navigate).toHaveBeenCalledWith(
      ['/sessions/403'],
      Object({ skipLocationChange: true })
    );
  });

  it('should redirect when not_found', () => {
    throwError(StatusCode.NOT_FOUND, 'NOT_FOUND');

    expect(router.navigate).toHaveBeenCalledWith(
      ['/sessions/404'],
      Object({ skipLocationChange: true })
    );
  });

  it('should redirect when internal_server_error', () => {
    throwError(StatusCode.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR');

    expect(router.navigate).toHaveBeenCalledWith(
      ['/sessions/500'],
      Object({ skipLocationChange: true })
    );
  });
});
