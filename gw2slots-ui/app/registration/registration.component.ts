import { Component } from '@angular/core';


@Component({
  selector: "registration",
  template: require('./registration.component.html'),
})
export class RegistrationComponent {
  model = {
    username: '',
    password: '',
    passwordVerify: '',
    apiKey: '',
  }

  invalid = {
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
}
