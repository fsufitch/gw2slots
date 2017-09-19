import { Injectable, Provider } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import { APIState, APIStateService } from './api';

interface RootStore {
  api: APIState;
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

  static getProviders(): Provider[] {
    return [
      RootStoreService,
      {
        provide: APIStateService,
        deps: [RootStoreService],
        useFactory: (rss: RootStoreService) => new APIStateService((a: Action) => rss.dispatch(a), rss.getAPIState()),
      },
    ];
  }
}
