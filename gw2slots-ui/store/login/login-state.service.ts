import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { LoginState, LoginStatus } from './login.state';

@Injectable()
export class LoginStateService {
  constructor(
    public dispatch: (a: Action) => void,
    private loginState$: Observable<LoginState>,
  ) {}

  getLoggedIn() {
    return this.loginState$.select(s => s.status === LoginStatus.LoggedIn);
  }

  getStatus() {
    return this.loginState$.select(s => s.status);
  }

  getUsername() {
    return this.loginState$.select(s => s.username);
  }

  getAuthToken() {
    return this.loginState$.select(s => s.authToken);
  }
}
