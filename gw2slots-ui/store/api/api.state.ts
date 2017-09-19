import { Record } from 'immutable';

export enum APIStatus { Unknown=0, Up, Down }

export interface APIState {
  host: string;
  status: APIStatus;
  error: string;
}
export class APIState extends Record({
  host: '',
  status: APIStatus.Unknown,
  error: '',
}) {
  setURL(host: string) {
    return <this>this.set('host', host);
  }

  setAPIHealth(status: APIStatus, error: string) {
    return <this>this.set('status', status).set('error', error);
  }
}
