import { Action } from '@ngrx/store';

export class LoadLoginFromLocalStorageAction implements Action {
  static type = 'gw2slots/login/storage/load';
  type = LoadLoginFromLocalStorageAction.type;
}

export class SaveLoginToLocalStorageAction implements Action {
  static type = 'gw2slots/login/storage/save';
  type = SaveLoginToLocalStorageAction.type;
  constructor(public payload: {username: string, authToken: string}) {}
}

export class ClearLoginFromLocalStorageAction implements Action {
  static type = 'gw2slots/login/storage/clear';
  type = ClearLoginFromLocalStorageAction.type;
}
