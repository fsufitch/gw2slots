import { Action } from '@ngrx/store';

export class LoginAction implements Action {
  static type = 'gw2slots/api/auth/login';
  type = LoginAction.type;
  constructor(public payload: {username: string, password: string}) {}
}

export class LogoutAction implements Action {
  static type = 'gw2slots/api/auth/logout';
  type = LogoutAction.type;
}
