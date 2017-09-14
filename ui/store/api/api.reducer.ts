import { ActionReducer, Action } from '@ngrx/store';

import { APIState } from './api.state';
import * as actions from './api.actions';

export const APIReducer: ActionReducer<APIState> = (state=new APIState(), action) => {
  switch (action.type) {
    case actions.APISetHostAction.type: {
      let host = (<actions.APISetHostAction>action).payload.host;
      state = state.setURL(host);
      break;
    }
    case actions.APISetHealthAction.type: {
      let {status, error} = (<actions.APISetHealthAction>action).payload;
      state = state.setAPIHealth(status, error);
    }
  }
  return state;
}
