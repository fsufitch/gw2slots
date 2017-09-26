import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';

import * as moment from 'moment';

import { AppStartAction, SetAuthenticatedAction } from 'gw2slots-ui/store';
import { FetchAndAuthenticateUserAction } from 'gw2slots-ui/app/api/auth.actions'; // Specific to avoid import loop
import { LocalStorageService } from 'gw2slots-ui/app/common/local-storage.service';
import * as loginActions from './login-local-storage.actions';

interface LoginLocalStorageData {
  username: string;
  authToken: string;
}

const LOGIN_STORAGE_KEY = 'gw2slots/login';
const REMEMBER_EXPIRATION_MILLIS = moment.duration(3, 'days').asMilliseconds()

@Injectable()
export class LoginLocalStorageEffects {
  constructor(
    private localStorageService: LocalStorageService,
    private actions$: Actions,
  ) {}

  @Effect() triggerLoadActionOnAppInit$ = this.actions$
    .ofType(AppStartAction.type)
    .map(() => new loginActions.LoadLoginFromLocalStorageAction());

  @Effect() loadLoginFromStore$ = this.actions$
    .ofType(loginActions.LoadLoginFromLocalStorageAction.type)
    .map(() => this.localStorageService.getItem<LoginLocalStorageData>(LOGIN_STORAGE_KEY))
    .do(data => !data ? console.log('No session data to load') : void(0))
    .filter(data => !!data)
    .switchMap(data => Observable.of(
      new SetAuthenticatedAction(data),
      new FetchAndAuthenticateUserAction({authToken: data.authToken}),
    ));

  @Effect() saveLoginToStore$ = this.actions$
    .ofType(loginActions.SaveLoginToLocalStorageAction.type)
    .map(a => (<loginActions.SaveLoginToLocalStorageAction>a).payload)
    .do(data => {
      this.localStorageService.setItem<LoginLocalStorageData>(LOGIN_STORAGE_KEY, data, REMEMBER_EXPIRATION_MILLIS);
      console.log('Remembered login data in local store');
    })
    .map(() => Observable.empty());

}
