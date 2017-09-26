import { ActionReducer, Action } from '@ngrx/store';

import { RegistrationState } from './registration.state';
import * as actions from './registration.actions';

export const RegistrationReducer: ActionReducer<RegistrationState> = (state=new RegistrationState(), action) => {
  switch (action.type) {
    case actions.RegistrationSetInProgressAction.type: {
      state = state.setInProgress();
      break;
    }
    case actions.RegistrationSetSuccessAction.type: {
      let {accountName, gameName} = (<actions.RegistrationSetSuccessAction>action).payload;
      state = state.setSuccess(accountName, gameName);
      break;
    }
    case actions.RegistrationSetFailureAction.type: {
      let {error} = (<actions.RegistrationSetFailureAction>action).payload;
      state = state.setError(error);
      break;
    }
    case actions.RegistrationResetAction.type: {
      state = state.reset();
      break;
    }
  }
  return state;
}
