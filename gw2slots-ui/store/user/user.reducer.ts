import { ActionReducer, Action } from '@ngrx/store';

import { UserState, User } from './user.state';
import * as actions from './user.actions';

export const UserReducer: ActionReducer<UserState> = (state=new UserState(), action) => {
  switch (action.type) {
    case actions.PutUserAction.type: {
      let user = (<actions.PutUserAction>action).payload.user;
      state = state.putUser(user);
      break;
    }

    case actions.RemoveUserAction.type: {
      let username = (<actions.RemoveUserAction>action).payload.username;
      state = state.removeUser(username);
      break;
    }
  }
  return state;
}
