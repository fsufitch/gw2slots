import { Action } from '@ngrx/store';

export class AppStartAction implements Action {
  static type = "gw2slots/appStart";
  type = AppStartAction.type;
}
