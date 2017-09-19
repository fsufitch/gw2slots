import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from 'gw2slots-ui/app/common';
import { StatusEffects } from './status.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([StatusEffects]),
  ],
})
export class ApiModule {}
