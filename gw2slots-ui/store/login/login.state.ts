import { Record } from 'immutable';

export enum LoginStatus { Unauthenticated=0, InProgress, LoggedIn, WrongCredentials }

export interface LoginState {
  status: LoginStatus;
  username: string;
  authToken: string;
}
export class LoginState extends Record({
  status: LoginStatus.Unauthenticated,
  username: '',
  authToken: '',
}) {
  setAuthenticated(username: string, authToken: string) {
    return <this>this.merge({username, authToken, status: LoginStatus.LoggedIn});
  }

  setUnauthenticated() {
    return <this>this.merge({username: '', authToken: '', status: LoginStatus.Unauthenticated});
  }

  setStatus(status: LoginStatus) {
    return <this>this.set('status', status);
  }
}
