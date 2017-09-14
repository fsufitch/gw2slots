import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';
import { StatusEffects } from './status.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([StatusEffects]),
  ],
})
export class ApiModule {}
