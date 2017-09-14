import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//import { StoreModule } from '../../store';

const IMPORT_EXPORT = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpModule,
  FormsModule,
]


@NgModule({
  imports: [
    ...IMPORT_EXPORT,
  ],
  providers: [
  ],
  declarations: [
  ],
  exports: [
    ...IMPORT_EXPORT,
  ],
})
export class CommonModule {}
