import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import * as api from './api';
import { RootStoreService } from './store.service';

const REDUCERS = {
  api: api.APIReducer,
};

@NgModule({
  imports: [
    NgrxStoreModule.forRoot(REDUCERS),
  ],
  providers: [
    ...RootStoreService.getProviders(),
  ],
  exports: [
  ]
})
export class StoreModule {}
