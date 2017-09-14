///<reference path="./vendor-types.d.ts" />

import '@angular/core';
import '@angular/common';
import '@angular/compiler';
import '@angular/forms';
import '@angular/http';
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/router';

import '@angular/platform-browser/animations';

import '@ngrx/core';
import '@ngrx/store';
import '@ngrx/effects';
import '@ngrx/core/add/operator/select';
import 'rxjs/Rx';

import 'moment';

import './fonts/vendor';

import 'jquery';

import { default as Popper } from 'popper.js';
declare global {
  interface Window {
    Popper: Popper;
  }
}
window.Popper = Popper;


import 'bootstrap';
require('style-loader!bootstrap/dist/css/bootstrap.min.css');
