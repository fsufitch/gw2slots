import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from 'gw2slots-ui/app/common';

import { RegistrationComponent } from './registration.component';
import { NotLoggedInGuard } from './not-logged-in.guard';

import { ROUTES } from './routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
  ],
  declarations: [
    RegistrationComponent,
  ],
  providers: [
    NotLoggedInGuard,
  ],
})
export class RegistrationModule {}
