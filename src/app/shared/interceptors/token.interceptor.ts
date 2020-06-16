import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { TokenService } from '@shared/authentication/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  protected env = environment;

  constructor(private tokenService: TokenService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.shouldAppendAuthorization(request)) {
      request = request.clone({
        headers: this.appendHeader(request.headers),
      });
    }

    return next.handle(request);
  }

  private shouldAppendAuthorization(request: HttpRequest<unknown>) {
    return (
      this.token().valid() && !request.headers.has('Authorization') && this.matchServerUrl(request)
    );
  }

  private matchServerUrl(request: HttpRequest<unknown>) {
    return (
      !/^http(s)?:\/\//.test(request.url) ||
      new RegExp(this.env.SERVER_URL.replace(/\/+$/, '')).test(request.url)
    );
  }

  private appendHeader(headers: HttpHeaders) {
    return headers.append('Authorization', this.token().header());
  }

  private token() {
    return this.tokenService.get();
  }
}
