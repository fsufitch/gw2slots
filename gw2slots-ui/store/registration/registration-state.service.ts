import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { RegistrationState } from './registration.state';

@Injectable()
export class RegistrationStateService {
  constructor(
    public dispatch: (a: Action) => void,
    private regState$: Observable<RegistrationState>,
  ) {}

  getStatus() {
    return this.regState$.select(r => r.status);
  }

  getSuccessData() {
    return this.regState$.select(r => ({
      accountName: r.successAccountName,
      gameName: r.successGameName,
    }));
  }

  getError() {
    return this.regState$.select(r => r.error);
  }
}
