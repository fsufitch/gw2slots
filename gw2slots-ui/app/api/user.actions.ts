import { Action } from '@ngrx/store';

export class FetchUserByUsernameAction implements Action {
  static type = 'gw2slots/api/login/fetchUserByUsername';
  type = FetchUserByUsernameAction.type;
  constructor(public payload: {username: string}) {}
}

export class FetchUserByGameNameAction implements Action {
  static type = 'gw2slots/api/login/fetchUserByGameName';
  type = FetchUserByGameNameAction.type;
  constructor(public payload: {gameName: string}) {}
}
