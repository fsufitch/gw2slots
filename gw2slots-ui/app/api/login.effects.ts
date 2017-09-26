import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { SetAuthenticatedAction, SetUnauthenticatedAction, SetLoginStatusAction, LoginStatus } from 'gw2slots-ui/store';
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
        responseOptions: {reportError: false},
      }).map(response => ({response, username}))
    ).share().do(x => console.log(x));

  @Effect() loginSuccess$ = this.login$
    .filter(({response}) => !!response.data)
    .flatMap(({response, username}) => Observable.of(
      new SetAuthenticatedAction({username, authToken: response.data.auth_token}),
      new FetchUserByUsernameAction({username}),
    ));

  @Effect() logoutFailure401$ = this.login$
    .filter(({response}) => response.status == 401)
    .do(() => console.log('wrong login'))
    .map(() => new SetLoginStatusAction({status: LoginStatus.WrongCredentials}));

  @Effect() logoutFailureGeneral$ = this.login$
    .filter(({response}) => !!response.error && response.status != 403)
    .do(({response}) => console.error(response.error))
    .map(() => new SetLoginStatusAction({status: LoginStatus.Unauthenticated}));
}
