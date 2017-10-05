import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import {
  SetAuthenticatedAction,
  SetUnauthenticatedAction,
  SetLoginStatusAction,
  LoginStatus,
} from 'gw2slots-ui/store';
import { HTTPCommonService } from './http-common.service';
import { LoginAction, LogoutAction } from './login.actions';
import { FetchUserByUsernameAction } from './user.actions';

interface LoginResponseData {
  auth_token: string,
  expires_on_unix_sec: number,
}

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private httpCommon: HTTPCommonService,
  ) {}

  login$ = this.actions$
    .ofType(LoginAction.type)
    .map(a => (<LoginAction>a).payload)
    .map(({username, password}) => {
      let headerValue = btoa(`${username}:${password}`);
      return {username, headers: {'Authorization': `Basic ${headerValue}`}};
    })
    .switchMap(({username, headers}) => this.httpCommon.simpleGet<LoginResponseData>('auth/login', {
        headers,
        useToken: false,
        responseOptions: {reportError: false, logoff403: false},
      }).map(response => ({response, username}))
    ).share();

  @Effect() loginSuccess$ = this.login$
    .filter(({response}) => !!response.data)
    .flatMap(({response, username}) => Observable.of(
      new SetAuthenticatedAction({username, authToken: response.data.auth_token}),
      new FetchUserByUsernameAction({username}),
    ));

  @Effect() loginFailure403$ = this.login$
    .filter(({response}) => response.status == 403)
    .do(() => alert('Bad username/password'))
    .map(() => new SetLoginStatusAction({status: LoginStatus.WrongCredentials}));

  @Effect() loginFailureGeneral$ = this.login$
    .filter(({response}) => !!response.error && response.status != 403)
    .do(({response}) => console.error(response.error))
    .map(() => new SetLoginStatusAction({status: LoginStatus.Unauthenticated}));


  logout$ = this.actions$
    .ofType(LogoutAction.type)
    .switchMap(() => this.httpCommon.simpleGet('auth/logout', {
      responseOptions: {json: false, logoff403: false},
    })).share();

  @Effect() logoutSuccess$ = this.logout$
    .filter(({error}) => !error)
    .map(() => new SetUnauthenticatedAction());

}
