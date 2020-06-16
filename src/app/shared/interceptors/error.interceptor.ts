import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '@shared/authentication/token.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum StatusCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorPages = [StatusCode.UNAUTHORIZED, StatusCode.FORBIDDEN, StatusCode.NOT_FOUND];

  constructor(private tokenService: TokenService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(err => {
        this.navigateToErrorPage(err);
        throw throwError(err.error.message || err.statusText);
      })
    );
  }

  private navigateToErrorPage(err: any) {
    if (!(err instanceof HttpErrorResponse)) {
      return;
    }

    const statusCode = this.errorPages.includes(err.status)
      ? err.status
      : StatusCode.INTERNAL_SERVER_ERROR;

    if (statusCode === StatusCode.UNAUTHORIZED) {
      this.tokenService.clear();
      this.router.navigate(['/auth/login'], {
        skipLocationChange: true,
      });
    } else {
      this.router.navigate([`/sessions/${statusCode}`], {
        skipLocationChange: true,
      });
    }
  }
}
