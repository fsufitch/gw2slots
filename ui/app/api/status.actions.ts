import { Action } from '@ngrx/store';

export class RefreshAPIStatusAction implements Action {
  static type = 'gw2slots/api/status/refresh';
  type = RefreshAPIStatusAction.type;
}

export class DiscoverAPIAction implements Action {
  static type = 'gw2slots/api/discover';
  type = DiscoverAPIAction.type;
  constructor(public payload: {host?: string}) {}
}
