import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';

import { SendRegistrationAction } from './registration.actions';
import {
  APIStateService,
  RegistrationStateService,
  RegistrationSetSuccessAction,
  RegistrationSetFailureAction,
} from 'gw2slots-ui/store';

import { UserResponseData } from './schema';
import { formatHTTPError } from './common';

interface CreateUserData {
  username: string,
  password: string,
  api_key: string,
}

@Injectable()
export class RegistrationEffects {
  constructor(
    private actions$: Actions,
    private http: Http,
    private apiStateService: APIStateService,
    private registrationStateService: RegistrationStateService,
  ) {}

  private host$ = this.apiStateService.getAPIHost();

  sendRegistration$ = this.actions$
    .ofType(SendRegistrationAction.type)
    .map(a => (<SendRegistrationAction>a).payload)
    .map(({username, password, apiKey}) => (<CreateUserData>{username, password, api_key: apiKey}))
    .flatMap(data => this.host$.take(1).map(host => ({host, data})))
    .flatMap(({host, data}) => this.http.post(`//${host}/user`,data)
      .do(response => {
        if (!response.ok) {
          throw `${response.statusText}: ${response.text()}`
        }
      })
      .map(response => ({response, error: null}))
      .catch(error => Observable.of({response: <Response>null, error}))
    ).share();

  @Effect() sendRegistrationSuccess$ = this.sendRegistration$
    .filter(({error}) => !error)
    .map(({response}) => (<UserResponseData>response.json()))
    .map(data => new RegistrationSetSuccessAction({
      accountName: data.username,
      gameName: data.game_name,
    }));

  @Effect() sendRegistrationFailure$ = this.sendRegistration$
    .filter(({error}) => !!error)
    .map(({error}) => formatHTTPError(error))
    .map(errorStr => new RegistrationSetFailureAction({error: errorStr}));
}
