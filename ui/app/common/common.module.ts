import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

//import { StoreModule } from '../../store';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    //StoreModule,
    FormsModule,
  ],
  providers: [
  ],
  declarations: [
  ],
  exports: [
    BrowserModule,
    HttpModule,
    //StoreModule,
    FormsModule,
  ],
})
export class CommonModule {}
