import { Injectable } from '@angular/core';
import { LocalStorageService } from '@shared/services/storage.service';
import { BehaviorSubject } from 'rxjs';

export class Token {
  public attributes: any = {
    accessToken: '',
    tokenType: '',
  };

  constructor(attrs: any) {
    Object.assign(this.attributes, attrs);
    if (attrs.access_token) {
      this.attributes.accessToken = attrs.access_token;
    }

    if (attrs.token_type) {
      this.attributes.tokenType = attrs.token_type;
    }
  }

  get accessToken() {
    return this.attributes.accessToken;
  }

  get tokenType() {
    return this.attributes.tokenType;
  }

  valid() {
    return !!this.accessToken;
  }

  header() {
    return `${this.tokenType} ${this.accessToken}`.trim();
  }

  toJson() {
    return this.attributes;
  }
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly key = '__access_token__';

  protected tokenSubject = new BehaviorSubject(this.get());

  constructor(private localStorageService: LocalStorageService) {}

  get() {
    return new Token(this.localStorageService.get(this.key));
  }

  set(token: Token | any) {
    token = token instanceof Token ? token : new Token(token ?? {});
    this.localStorageService.set(this.key, token.toJson());
    this.tokenSubject.next(token);

    return this;
  }

  clear() {
    this.localStorageService.remove(this.key);
    this.tokenSubject.next(new Token({}));

    return this;
  }

  changed() {
    return this.tokenSubject;
  }
}
