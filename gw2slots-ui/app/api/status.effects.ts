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

import { formatHTTPError } from './common';

declare var GW2SLOTS_API_HOST: string;

@Injectable()
export class StatusEffects {
  constructor(
    private actions$: Actions,
    private http: Http,
    private apiStateService: APIStateService,
  ) {}

  @Effect() discoverAPIOnAppStart$ = this.actions$
    .ofType(AppStartAction.type)
    .map(() => new DiscoverAPIAction({}));

  @Effect() discoverAPI$ = this.actions$
    .ofType(DiscoverAPIAction.type)
    .map(action => (<DiscoverAPIAction>action).payload.host)
    .map(host => host || GW2SLOTS_API_HOST)
    .switchMap(host => this.http.get(`//${host}/health`)
      .do(response => {
        if (!response.ok) {
          throw `${response.statusText}: ${response.text()}`
        }
      })
      .map(response => ({host, response, error: null}))
      .catch(error => Observable.of({host, response: <Response>null, error}))
    )
    .flatMap(({host, response, error}) => Observable.of<Action>(
      new APISetHostAction({host: host}),
      new APISetHealthAction({
        status: !error ? APIStatus.Up : APIStatus.Down,
        error: formatHTTPError(error),
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
