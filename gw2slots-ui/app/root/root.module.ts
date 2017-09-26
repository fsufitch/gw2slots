import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { CommonModule } from 'gw2slots-ui/app/common';
import { ApiModule } from 'gw2slots-ui/app/api';
import { AuthModule } from 'gw2slots-ui/app/auth';

import { RootComponent } from './root.component';
import { NavigationComponent } from './navigation';
import { HomepageComponent } from './homepage';
import { FAQComponent } from './faq';
import { AboutComponent } from './about';

import { ROUTES } from './routes';

@NgModule({
  imports: [
    CommonModule,
    ApiModule,
    EffectsModule.forRoot([]),
    RouterModule.forRoot(ROUTES),
    AuthModule,
  ],
  declarations: [
    RootComponent,
    NavigationComponent,
    HomepageComponent,
    FAQComponent,
    AboutComponent,
  ],
  bootstrap: [
    RootComponent,
  ],
})
export class RootModule {}
