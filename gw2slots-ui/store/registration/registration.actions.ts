import { Action } from '@ngrx/store';
import { RegistrationStatus } from './registration.state';

export class RegistrationSetInProgressAction implements Action {
  static type = 'gw2slots/registration/setInProgress'
  type = RegistrationSetInProgressAction.type;
}

export class RegistrationSetSuccessAction implements Action {
  static type = 'gw2slots/registration/setSuccess';
  type = RegistrationSetSuccessAction.type;
  constructor(public payload: {accountName: string, gameName: string}) {}
}

export class RegistrationSetFailureAction implements Action {
  static type = 'gw2slots/registration/setFailure';
  type = RegistrationSetFailureAction.type;
  constructor(public payload: {error: string}) {}
}

export class RegistrationResetAction implements Action {
  static type = 'gw2slots/registration/reset';
  type = RegistrationResetAction.type;
}
