import { NgModule } from '@angular/core';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import * as api from './api';
import * as registration from './registration';
import * as login from './login';
import * as user from './user';
import { RootStoreService } from './store.service';

const REDUCERS = {
  api: api.APIReducer,
  registration: registration.RegistrationReducer,
  login: login.LoginReducer,
  user: user.UserReducer,
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
