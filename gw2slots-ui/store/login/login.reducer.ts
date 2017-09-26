import { ActionReducer, Action } from '@ngrx/store';

import { LoginState } from './login.state';
import * as actions from './login.actions';

export const LoginReducer: ActionReducer<LoginState> = (state=new LoginState(), action) => {
  switch (action.type) {
    case actions.SetAuthenticatedAction.type: {
      let {username, authToken} = (<actions.SetAuthenticatedAction>action).payload;
      state = state.setAuthenticated(username, authToken);
      break;
    }
    case actions.SetUnauthenticatedAction.type: {
      state = state.setUnauthenticated();
      break;
    }
    case actions.SetLoginStatusAction.type: {
      let { status } = (<actions.SetLoginStatusAction>action).payload;
      state = state.setStatus(status);
      break;
    }
  }
  return state;
}
