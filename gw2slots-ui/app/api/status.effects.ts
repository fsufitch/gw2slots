import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  AppStartAction,
  APISetHostAction,
  APISetHealthAction,
  APIStatus,
  APIStateService,
} from 'gw2slots-ui/store';
import {
  DiscoverAPIAction,
  RefreshAPIStatusAction,
} from './status.actions';

import { HTTPCommonService } from './http-common.service';

declare var GW2SLOTS_API_HOST: string;

@Injectable()
export class StatusEffects {
  constructor(
    private actions$: Actions,
    private httpCommon: HTTPCommonService,
    private apiStateService: APIStateService,
  ) {}

  @Effect() discoverAPIOnAppStart$ = this.actions$
    .ofType(AppStartAction.type)
    .map(() => new DiscoverAPIAction({}));

  @Effect() discoverAPI$ = this.actions$
    .ofType(DiscoverAPIAction.type)
    .map(action => (<DiscoverAPIAction>action).payload.host)
    .map(host => host || GW2SLOTS_API_HOST)
    .switchMap(host => this.httpCommon.simpleGet('health', {
        host,
        useToken: false,
        responseOptions: {json: false},
      }).map(response => ({host, response}))
    )
    .flatMap(({host, response}) => Observable.of<Action>(
      new APISetHostAction({host: host}),
      new APISetHealthAction({
        status: !response.error ? APIStatus.Up : APIStatus.Down,
        error: response.error,
      })
    ));

  @Effect() refreshAPIStatus$ = this.actions$
    .ofType(RefreshAPIStatusAction.type)
    .flatMap(() => this.apiStateService.getAPIHost().take(1))
    .flatMap(host => Observable.of<Action>(
      new APISetHealthAction({status: APIStatus.Unknown, error: ''}),
      new DiscoverAPIAction({host}),
    ))

}
