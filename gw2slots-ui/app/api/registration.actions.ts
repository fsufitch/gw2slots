import { Action } from '@ngrx/store';

export class SendRegistrationAction implements Action {
  static type = 'gw2slots/api/registration/send';
  type = SendRegistrationAction.type;
  constructor(public payload: {username: string, password: string, apiKey: string}) {}
}
