import { Action } from '@ngrx/store';

export class FetchAndAuthenticateUserAction implements Action {
  static type = 'gw2slots/api/login/fetchCurrentUser';
  type = FetchAndAuthenticateUserAction.type;
  constructor(public payload: {authToken: string}) {}
}
