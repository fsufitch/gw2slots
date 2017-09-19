import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { APIState } from './api.state';

@Injectable()
export class APIStateService {
  constructor(
    public dispatch: (a: Action) => void,
    private apiState$: Observable<APIState>,
  ) {}

  getAPIHost() {
    return this.apiState$.select(s => s.host);
  }

  getAPIStatus() {
    return this.apiState$.select(s => s.status);
  }

  getAPIError() {
    return this.apiState$.select(s => s.error);
  }
}
