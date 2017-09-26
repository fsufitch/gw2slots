import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginStateService } from 'gw2slots-ui/store/login';
import { UserStateService, User } from 'gw2slots-ui/store/user';

@Injectable()
export class CurrentUserService {
  constructor(
    private loginStateService: LoginStateService,
    private userStateService: UserStateService,
  ) {}

  getCurrentUser(){
    let currentUsername$ = this.loginStateService.getUsername();

    return this.loginStateService.getLoggedIn()
      .switchMap(loggedIn => loggedIn
        ? currentUsername$.switchMap(username => this.userStateService.getUserByUsername(username))
        : Observable.of(<User>undefined)
      );
  }
}
