import { Action } from '@ngrx/store';
import { LoginStatus } from './login.state';

export class SetAuthenticatedAction implements Action {
  static type = 'gw2slots/login/set';
  type = SetAuthenticatedAction.type;
  constructor(public payload: {username: string, authToken: string}) {}
}

export class SetUnauthenticatedAction implements Action {
  static type = 'gw2slots/login/unauthenticated';
  type = SetUnauthenticatedAction.type;
}

export class SetLoginStatusAction implements Action {
  static type = 'gw2slots/login/setStatus';
  type = SetLoginStatusAction.type;
  constructor(public payload: {status: LoginStatus}) {}
}
