import { Action } from '@ngrx/store';

export class LoadLoginFromLocalStorageAction implements Action {
  static type = 'gw2slots/login/storage/load';
  type = LoadLoginFromLocalStorageAction.type;
  constructor() {}
}

export class SaveLoginToLocalStorageAction implements Action {
  static type = 'gw2slots/login/storage/save';
  type = LoadLoginFromLocalStorageAction.type;
  constructor(public payload: {username: string, gameName: string, authToken: string}) {}
}
