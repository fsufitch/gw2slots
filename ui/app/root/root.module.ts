import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';

import { RootComponent } from './root.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RootComponent,
  ],
  bootstrap: [
    RootComponent,
  ],
})
export class RootModule {}
