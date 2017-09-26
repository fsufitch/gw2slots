import { Record, Map } from 'immutable';
import * as moment from 'moment';

export interface User {
  username: string;
  gameName: string;
  createdOn: moment.Moment;
  balance?: number;
  permissions?: {[key: string]: boolean};
}

export interface UserState {
  usersByUsername: Map<string, User>,
  usersByGameName: Map<string, User>,
}
export class UserState extends Record({
  usersByID: Map.of(),
  usersByGameName: Map.of(),
}) {
  putUser(u: User) {
    return <this>this
      .setIn(['usersByUsername', u.username], u)
      .setIn(['usersByGameName', u.gameName], u);
  }

  removeUser(username: string) {
    let u: User = this.usersByUsername.get(username);
    if (!u) return;

    return <this>this
      .removeIn(['usersByUsername', u.username])
      .removeIn(['usersByGameName', u.gameName]);
  }
}
