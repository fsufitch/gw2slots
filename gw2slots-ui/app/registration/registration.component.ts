import { Component, ElementRef, ViewChild, OnDestroy, OnInit } from '@angular/core';

import { SendRegistrationAction } from 'gw2slots-ui/app/api';
import {
  RegistrationStateService,
  RegistrationStatus,
  RegistrationResetAction,
  RegistrationSetInProgressAction,
} from 'gw2slots-ui/store/registration';

@Component({
  selector: "registration",
  template: require('./registration.component.html'),
})
export class RegistrationComponent implements OnDestroy, OnInit {
  constructor(private registrationStateService: RegistrationStateService) {}

  @ViewChild('registrationNotification') notificationModal: ElementRef;

  private registrationStatus$ = this.registrationStateService.getStatus();
  registrationNotSent$ = this.registrationStatus$.map(status => status == RegistrationStatus.NotSent);
  registrationInProgress$ = this.registrationStatus$.map(status => status === RegistrationStatus.InProgress);
  registrationSuccess$ = this.registrationStatus$.map(status => status === RegistrationStatus.Success);
  registrationFailure$ = this.registrationStatus$.map(status => status === RegistrationStatus.Failure);

  registeredAccountName$ = this.registrationStateService.getSuccessData().map(data => data.accountName);
  registeredGameName$ = this.registrationStateService.getSuccessData().map(data => data.gameName);
  registrationError$ = this.registrationStateService.getError();

  popupSubscription = this.registrationSuccess$
    .zip(this.registrationFailure$)
    .filter(([success, fail]) => success || fail) // Whenever either a success or fail comes down the line
    .subscribe(() => $(this.notificationModal.nativeElement).modal('show'));

  model: {[key: string]:string} = {
    username: '',
    password: '',
    passwordVerify: '',
    apiKey: '',
  }

  invalid: {[key: string]:string} = {
    username: '',
    password: '',
    apiKey: '',
  }

  updateValidity() {
    this.invalid.username = '';
    if (!this.model.username) {
      this.invalid.username = 'missing';
    }

    this.invalid.password = '';
    if (!this.model.password || !this.model.passwordVerify) {
      this.invalid.password = 'missing';
    }
    if (this.model.password != this.model.passwordVerify) {
      this.invalid.password = 'nomatch';
    }

    this.invalid.apiKey = '';
    if (!this.model.apiKey) {
      this.invalid.apiKey = 'missing';
    }
  }

  trySubmit() {
    this.updateValidity();
    for (let key in this.invalid) {
      if (!!this.invalid[key]) {
        alert('The form has invalid values. Please fix them and try again.');
        return;
      }
    }
    this.registrationStateService.dispatch(new RegistrationSetInProgressAction());
    this.registrationStateService.dispatch(new SendRegistrationAction({
      username: this.model.username,
      password: this.model.password,
      apiKey: this.model.apiKey,
    }));
  }

  resetRegistration() {
    this.registrationStateService.dispatch(new RegistrationResetAction());
  }

  ngOnInit() {
    $(this.notificationModal.nativeElement).on('hidden.bs.modal', () => this.resetRegistration());
  }

  ngOnDestroy() {
    this.popupSubscription.unsubscribe();
  }
}
