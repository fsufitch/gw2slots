import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';

import { FetchAndAuthenticateUserAction } from './auth.actions';
import { FetchUserByUsernameAction } from './user.actions';

import { HTTPCommonService } from './http-common.service';
import { SetAuthenticatedAction, SetUnauthenticatedAction } from 'gw2slots-ui/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private httpCommon: HTTPCommonService,
  ) {}

  fetchAndAuthenticate$ = this.actions$
    .ofType(FetchAndAuthenticateUserAction.type)
    .map(a => (<FetchAndAuthenticateUserAction>a).payload.authToken)
    .switchMap(token => this.httpCommon.simpleGet<string>('auth/current_user', {
        token: token,
        responseOptions: {json: false, logoff403: false, reportError: false},
      }).map(response => ({response, token}))
    ).share();

  @Effect() fetchAndAuthenticateSuccess$ = this.fetchAndAuthenticate$
    .filter(({response}) => !!response.data)
    .flatMap(({response, token}) => Observable.of(
      new SetAuthenticatedAction({username: response.data, authToken: token}),
      new FetchUserByUsernameAction({username: response.data}),
    ));

  @Effect() fetchAndAuthenticateFailure$ = this.fetchAndAuthenticate$
    .filter(({response}) => !!response.error)
    .do(({response, token}) => {
      if (response.status == 403) {
        alert('Your login has expired');
        console.warn(`Token login error, logging off`, token);
      } else {
        console.error('Unknown error', response.error);
      }
    })
    .flatMap(() => Observable.of(
      new SetUnauthenticatedAction(),
    ));
}
