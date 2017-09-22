import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import * as api from './api';
import * as registration from './registration';
import { RootStoreService } from './store.service';

const REDUCERS = {
  api: api.APIReducer,
  registration: registration.RegistrationReducer,
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
