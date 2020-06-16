import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class SanctumInterceptor implements HttpInterceptor {
  protected env = environment;

  private initialize = false;

  constructor(private http: HttpClient) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: this.withCredentials(request),
    });

    return this.initialize
      ? next.handle(request)
      : of((this.initialize = true)).pipe(
          switchMap(_ => this.http.get('/sanctum/csrf-cookie')),
          switchMap(_ => next.handle(request))
        );
  }

  private withCredentials(request: HttpRequest<unknown>) {
    return (
      !/^http(s)?:\/\//.test(request.url) ||
      new RegExp(this.env.SERVER_URL.replace(/\/+$/, '')).test(request.url)
    );
  }
}
