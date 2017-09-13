import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';

import { RootComponent } from './root.component';
import { GlobalStylesComponent } from './global-styles.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    RootComponent,
    GlobalStylesComponent,
  ],
  bootstrap: [
    RootComponent,
  ],
})
export class RootModule {}
