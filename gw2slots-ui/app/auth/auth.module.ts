import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from 'gw2slots-ui/app/common';

import * as registration from './registration';
import * as login from './login';
import { NotLoggedInGuard } from './not-logged-in.guard';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(registration.ROUTES),
  ],
  declarations: [
    ...registration.COMPONENTS,
    ...login.COMPONENTS,
  ],
  providers: [
    NotLoggedInGuard,
  ],
  exports: [
    ...registration.COMPONENTS,
    ...login.COMPONENTS,
  ]
})
export class AuthModule {}
