import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

@Injectable()
export class ServerUrlInterceptor implements HttpInterceptor {
  protected env = environment;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!/^http(s)?:/.test(request.url)) {
      request = request.clone({ url: this.apiUrl(request) });
    }

    return next.handle(request);
  }

  private apiUrl(request: HttpRequest<unknown>): string {
    return this.getSegmentArray(request)
      .filter(u => !!u)
      .join('/')
      .replace(/([^:]\/)\/+/g, '$1');
  }

  private getSegmentArray(request: HttpRequest<unknown>) {
    return request.url.match(/sanctum\/csrf-cookie/)
      ? [this.env.SERVER_URL, request.url]
      : [this.env.SERVER_URL, this.env.API_ENDPOINT, request.url];
  }
}
