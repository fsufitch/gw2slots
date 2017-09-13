import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import * as material from '@angular/material';

//import { StoreModule } from '../../store';

const IMPORT_EXPORT = [
  BrowserModule,
  BrowserAnimationsModule,
  HttpModule,
  FormsModule,
  material.MdCheckboxModule,
  material.MdButtonModule,
  material.MdFormFieldModule,
  material.MdFormFieldModule,
  material.MdInputModule,
  material.MdCardModule,
  material.MdProgressSpinnerModule,
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
