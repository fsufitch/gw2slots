import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from 'gw2slots-ui/app/common';
import { StatusEffects } from './status.effects';
import { RegistrationEffects } from './registration.effects';
import { HTTPCommonService } from './http-common.service';
import { AuthEffects } from './auth.effects';
import { LoginEffects } from './login.effects';
import { UserEffects } from './user.effects';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      StatusEffects,
      RegistrationEffects,
      AuthEffects,
      LoginEffects,
      UserEffects,
    ]),
  ],
  providers: [
    HTTPCommonService,
  ]
})
export class ApiModule {}
