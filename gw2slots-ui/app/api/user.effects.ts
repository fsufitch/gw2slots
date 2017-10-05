import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { HTTPCommonService } from './http-common.service';
import { FetchUserByUsernameAction, FetchUserByGameNameAction } from './user.actions';
import { UserResponseData } from './schema';
import { PutUserAction } from 'gw2slots-ui/store';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private httpCommon: HTTPCommonService,
  ) {}

  @Effect() fetchUserByUsername$ = this.actions$
    .ofType(FetchUserByUsernameAction.type)
    .map(a => (<FetchUserByUsernameAction>a).payload.username)
    .switchMap(username => this.httpCommon.simpleGet<UserResponseData>(`user/${username}`))
    .filter(({data}) => !!data)
    .map(({data}) => new PutUserAction({user: {
      username: data.username,
      gameName: data.game_name,
      createdOn: moment.unix(data.created_on_unix_sec),
      balance: data.balance,
      permissions: data.permissions,
    }}));

  @Effect() fetchUserByGameName$ = this.actions$
    .ofType(FetchUserByGameNameAction.type)
    .map(a => (<FetchUserByGameNameAction>a).payload.gameName)
    .switchMap(gameName => this.httpCommon.simpleGet<UserResponseData>(`user/${gameName}`, {
      responseOptions: {logoff403: false},
    }))
    .filter(({data}) => !!data)
    .map(({data}) => new PutUserAction({user: {
      username: data.username,
      gameName: data.game_name,
      createdOn: moment.unix(data.created_on_unix_sec),
      balance: data.balance,
      permissions: data.permissions,
    }}));

}
