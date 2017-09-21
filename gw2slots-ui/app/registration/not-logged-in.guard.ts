import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    return Observable.of(true);
  }
}
