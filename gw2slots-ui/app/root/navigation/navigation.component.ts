import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  template: require('./navigation.component.html'),
})
export class NavigationComponent {
  buttonTriggered = false;

  doNothing() {
    if (!this.buttonTriggered) {
      this.buttonTriggered = true;
      alert('That doesn\'t do anything.');
    } else {
      alert('That doesn\'t do anything either. Stop clicking stuff.');
    }
  }

}
