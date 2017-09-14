import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from '../common';

import { RootComponent } from './root.component';
import { NavigationComponent } from './navigation';
import { HomepageComponent } from './homepage';
import { FAQComponent } from './faq';

import { ROUTES } from './routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES),
  ],
  declarations: [
    RootComponent,
    NavigationComponent,
    HomepageComponent,
    FAQComponent,
  ],
  bootstrap: [
    RootComponent,
  ],
})
export class RootModule {}
