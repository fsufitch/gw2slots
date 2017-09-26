import { Injectable, Provider } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import { APIState, APIStateService } from './api';
import { RegistrationState, RegistrationStateService } from './registration';
import { LoginState, LoginStateService } from './login';
import { UserState, UserStateService } from './user';

import { CurrentUserService } from './derived';

interface RootStore {
  api: APIState;
  registration: RegistrationState;
  login: LoginState;
  user: UserState;
}

@Injectable()
export class RootStoreService {
  constructor(private store: Store<RootStore>) {}

  dispatch(a: Action) {
    this.store.dispatch(a);
  }

  getAPIState() {
    return this.store.let(s => s.select(s => s.api));
  }

  getRegistrationState() {
    return this.store.let(s => s.select(s => s.registration));
  }

  getLoginState() {
    return this.store.let(s => s.select(s => s.login));
  }

  getUserState() {
    return this.store.let(s => s.select(s => s.user));
  }

  static getProviders(): Provider[] {
    let proxyDispatch = (rss: RootStoreService) => ((a: Action) => rss.dispatch(a));
    return [
      RootStoreService,
      CurrentUserService,
      {
        provide: APIStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new APIStateService(proxyDispatch(rss), rss.getAPIState()),
      },
      {
        provide: RegistrationStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new RegistrationStateService(proxyDispatch(rss), rss.getRegistrationState()),
      },
      {
        provide: LoginStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new LoginStateService(proxyDispatch(rss), rss.getLoginState()),
      },
      {
        provide: UserStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new UserStateService(proxyDispatch(rss), rss.getUserState()),
      },
    ];
  }
}
