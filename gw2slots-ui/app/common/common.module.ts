import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';


import { IconComponent } from './icon.component';

import { StoreModule } from 'gw2slots-ui/store';

const IMPORT_EXPORT = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpModule,
  FormsModule,
  StoreModule,
]


@NgModule({
  imports: [
    ...IMPORT_EXPORT,
  ],
  providers: [
  ],
  declarations: [
    IconComponent,
  ],
  exports: [
    ...IMPORT_EXPORT,
    IconComponent,
  ],
})
export class CommonModule {}
