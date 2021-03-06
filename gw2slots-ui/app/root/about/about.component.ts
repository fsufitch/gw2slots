import { Component } from '@angular/core';

import { APIStateService, APIStatus } from 'gw2slots-ui/store';
import { RefreshAPIStatusAction } from 'gw2slots-ui/app/api';

@Component({
  selector: 'about',
  template: require('./about.component.html'),
})
export class AboutComponent {
  apiHost$ = this.apiStateService.getAPIHost();
  apiError$ = this.apiStateService.getAPIError();

  private status$ = this.apiStateService.getAPIStatus();
  apiStatusUnknown$ = this.status$.map(s => s == APIStatus.Unknown);
  apiStatusUp$ = this.status$.map(s => s == APIStatus.Up);
  apiStatusDown$ = this.status$.map(s => s == APIStatus.Down);

  constructor(private apiStateService: APIStateService) {}

  refreshAPIStatus() {
    this.apiStateService.dispatch(new RefreshAPIStatusAction());
  }
}
