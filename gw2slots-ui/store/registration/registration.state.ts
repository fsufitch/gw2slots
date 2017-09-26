import { Record } from 'immutable';

export enum RegistrationStatus { NotSent=0, InProgress, Success, Failure }

export interface RegistrationState {
  status: RegistrationStatus;
  successAccountName: string;
  successGameName: string;
  error: string;
}
export class RegistrationState extends Record({
  status: RegistrationStatus.NotSent,
  successAccountName: '',
  successGameName: '',
  error: '',
}) {
  setInProgress() {
    return <this>this.set('status', RegistrationStatus.InProgress);
  }

  setSuccess(accountName: string, gameName: string) {
    return <this>this.merge({
      status: RegistrationStatus.Success,
      successAccountName: accountName,
      successGameName: gameName,
    });
  }

  setError(error: string) {
    return <this>this.merge({
      status: RegistrationStatus.Failure,
      error,
    });
  }

  reset() {
    return <this>this.set('status', RegistrationStatus.NotSent);
  }
}
