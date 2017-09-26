import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { UserState } from './user.state';

@Injectable()
export class UserStateService {
  constructor(
    public dispatch: (a: Action) => void,
    private userState$: Observable<UserState>,
  ) {}

  getUserByUsername(username: string) {
    return this.userState$
      .select(s => s.usersByUsername)
      .select(m => m.get(username));
  }

  getUserByGameName(gameName: string) {
    return this.userState$
      .select(s => s.usersByGameName)
      .select(m => m.get(gameName));
  }
}
