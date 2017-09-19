import { Action } from '@ngrx/store';
import { APIStatus } from './api.state';

export class APISetHostAction implements Action {
  static type = "gw2slots/api/setHost"
  type = APISetHostAction.type;
  constructor(public payload: {host: string}) {}
}

export class APISetHealthAction implements Action {
  static type = "gw2slots/api/setHealth"
  type = APISetHealthAction.type;
  constructor(public payload: {status: APIStatus, error?: string}) {}
}
