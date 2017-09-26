import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Effect, Actions } from '@ngrx/effects';

import { Observable } from 'rxjs';

import { SendRegistrationAction } from './registration.actions';
import {
  RegistrationSetSuccessAction,
  RegistrationSetFailureAction,
} from 'gw2slots-ui/store';

import { HTTPCommonService } from './http-common.service';
import { UserResponseData } from './schema';

interface CreateUserData {
  username: string,
  password: string,
  api_key: string,
}

@Injectable()
export class RegistrationEffects {
  constructor(
    private actions$: Actions,
    private httpCommon: HTTPCommonService,
  ) {}

  sendRegistration$ = this.actions$
    .ofType(SendRegistrationAction.type)
    .map(a => (<SendRegistrationAction>a).payload)
    .map(({username, password, apiKey}) => (<CreateUserData>{username, password, api_key: apiKey}))
    .flatMap(data => this.httpCommon.simplePost<UserResponseData>('user', data, {
      useToken: false,
      responseOptions: {logoff403: false},
    })).share();

  @Effect() sendRegistrationSuccess$ = this.sendRegistration$
    .filter(({data}) => !!data)
    .map(({data}) => new RegistrationSetSuccessAction({
      accountName: data.username,
      gameName: data.game_name,
    }));

  @Effect() sendRegistrationFailure$ = this.sendRegistration$
    .filter(({error}) => !!error)
    .map(({error}) => new RegistrationSetFailureAction({error}));
}
