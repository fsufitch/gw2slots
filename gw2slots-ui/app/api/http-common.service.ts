import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIStateService, LoginStateService } from 'gw2slots-ui/store';
import { LogoutAction } from './login.actions';

interface CleanResponse<T> {
  status: number;
  data: T;
  error: string;
}

interface CleanResponseOptions {
  json?: boolean;
  logoff403?: boolean;
  reportError?: boolean;
}

interface SimpleRequestOptions {
  host?: string;
  params?: {[key: string]: string|[string]};
  useToken?: boolean;
  token?: string;
  headers?: {[key: string]: string | string[]}
  responseOptions?: CleanResponseOptions;
}


@Injectable()
export class HTTPCommonService {
  constructor(
    public http: Http,
    private apiStateService: APIStateService,
    private loginStateService: LoginStateService,
  ) {}

  private apiHost$ = this.apiStateService.getAPIHost();
  private authToken$ = this.loginStateService.getAuthToken();

  clean<T>(response$: Observable<Response>, options: CleanResponseOptions={}): Observable<CleanResponse<T>> {
    options = { // Defaults
      json: true,
      logoff403: true,
      reportError: true,
      ...options
    };

    let dualResponse$ = response$
      .map(r => ({response: r, error: <HttpErrorResponse>null}))
      .catch((err: HttpErrorResponse) => Observable.of({response: <Response>null, error: err}));

    let responseOK = dualResponse$.filter(({response}) => !!response && response.ok)
      .map(({response}) => ({
        status: response.status,
        data: options.json ? response.json() : response.text(),
        error: null,
      }));

    let responseError = dualResponse$.filter(({response}) => !response || !response.ok)
      .map(({error}) => ({
        status: error.status,
        data: null,
        error: this.formatHTTPError(error),
      }));

    if (options.reportError) {
      responseError.filter(err => !!err).subscribe(data => this.reportError(data.error));
    }

    if (options.logoff403) {
      responseError.filter(data => data.status == 403).subscribe(() => this.logoff403());
    }

    return Observable.merge(responseOK, responseError);
  }

  formatHTTPError(err: HttpErrorResponse) {
    if (!err) return 'no error data';
    return err.message || `[${err.error || err}]`;
  }

  logoff403() {
    console.error('403 Forbidden received, logging out');
    this.loginStateService.dispatch(new LogoutAction());
  }

  reportError(error: any) {
    console.error(error);
  }

  getAPIHost() {
    return this.apiStateService.getAPIHost();
  }

  tokenAuthHeader(token: string) {
    let headers = new Headers();
    headers.set('Authorization', `Bearer ${token}`)
    return headers;
  }

  simpleGet<T>(path: string, options: SimpleRequestOptions={}) {
    options = { // Defaults
      host: '',
      params: {},
      useToken: true,
      token: '',
      headers: {},
      responseOptions: {},
      ...options,
    };

    let paramString = $.param(options.params);

    let headers$: Observable<Headers>;
    if (options.useToken) {
      if (!!options.token) {
        headers$ = Observable.of(this.tokenAuthHeader(options.token));
      } else {
        headers$ = this.authToken$.map(t => this.tokenAuthHeader(t));
      }
    } else {
      headers$ = Observable.of(new Headers());
    }

    headers$ = headers$.map(h => {
      for (let key in options.headers) {
        h.set(key, options.headers[key]);
      }
      return h;
    });

    let host$: Observable<string>;
    if (!!options.host) {
      host$ = Observable.of(options.host);
    } else {
      host$ = this.apiHost$;
    }

    let response$ = Observable.combineLatest(host$, headers$)
      .take(1)
      .switchMap(([host, headers]) => this.http.get(`//${host}/${path}${paramString}`, { headers }))
      .share();

    return this.clean<T>(response$, options.responseOptions);
  }

  simplePost<T>(path: string, data: any, options: SimpleRequestOptions={}) {
    options = { // Defaults
      host: '',
      params: {},
      useToken: true,
      token: '',
      headers: {},
      responseOptions: {},
      ...options,
    };

    let paramString = $.param(options.params);

    let headers$: Observable<Headers>;
    if (options.useToken) {
      if (!!options.token) {
        headers$ = Observable.of(this.tokenAuthHeader(options.token));
      } else {
        headers$ = this.authToken$.map(t => this.tokenAuthHeader(t));
      }
    } else {
      headers$ = Observable.of(new Headers());
    }

    headers$ = headers$.map(h => {
      for (let key in options.headers) {
        h.set(key, options.headers[key]);
      }
      return h;
    });

    let host$: Observable<string>;
    if (!!options.host) {
      host$ = Observable.of(options.host);
    } else {
      host$ = this.apiHost$;
    }

    let response$ = Observable.combineLatest(host$, headers$)
      .take(1)
      .switchMap(([host, headers]) => this.http.post(`//${host}/${path}${paramString}`, data, { headers }))
      .share();

    return this.clean<T>(response$, options.responseOptions);
  }
}
