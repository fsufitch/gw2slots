import { Action } from '@ngrx/store';

import { User } from './user.state';

export class PutUserAction implements Action {
  static type = 'gw2slots/user/put';
  type = PutUserAction.type;
  constructor(public payload: {user: User}) {}
}

export class RemoveUserAction implements Action {
  static type = 'gw2slots/user/remove';
  type = RemoveUserAction.type;
  constructor(public payload: {username: string}) {}
}
