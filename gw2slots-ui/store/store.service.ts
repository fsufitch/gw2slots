import { Injectable, Provider } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import { APIState, APIStateService } from './api';
import { RegistrationState, RegistrationStateService } from './registration';

interface RootStore {
  api: APIState;
  registration: RegistrationState;
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

  static getProviders(): Provider[] {
    let proxyDispatch = (rss: RootStoreService) => ((a: Action) => rss.dispatch(a));
    return [
      RootStoreService,
      {
        provide: APIStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new APIStateService(proxyDispatch(rss), rss.getAPIState()),
      },
      {
        provide: RegistrationStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new RegistrationStateService(proxyDispatch(rss), rss.getRegistrationState()),
      }
    ];
  }
}
