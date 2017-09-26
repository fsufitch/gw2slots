import { Component } from '@angular/core';

import { LoginStateService, CurrentUserService } from 'gw2slots-ui/store';
import { LoginAction, LogoutAction } from 'gw2slots-ui/app/api';

@Component({
  selector: 'login-controls',
  template: require('./login-controls.component.html'),
})
export class LoginControlsComponent {
  constructor(
    private loginStateService: LoginStateService,
    private currentUserService: CurrentUserService,
  ) {}

  loggedIn$ = this.loginStateService.getLoggedIn();
  currentUser$ = this.currentUserService.getCurrentUser().filter(u => !!u);
  username$ = this.currentUser$.map(u => u.username);
  gameName$ = this.currentUser$.map(u => u.gameName);

  inputUsername: string;
  inputPassword: string;

  login() {
    console.log('login', this.inputUsername, this.inputPassword);
    this.loginStateService.dispatch(new LoginAction({
      username: this.inputUsername,
      password: this.inputPassword,
    }));
  }

  logout() {
    this.loginStateService.dispatch(new LogoutAction());
  }
}
