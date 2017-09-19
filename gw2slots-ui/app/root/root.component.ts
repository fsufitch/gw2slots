import { Component, OnInit } from '@angular/core';

import { RootStoreService, AppStartAction } from 'gw2slots-ui/store';

@Component({
  selector: 'ng2app',
  template: require('./root.component.html'),
  styles: [
    require('./root.component.scss'),
  ],
})
export class RootComponent implements OnInit {
  constructor(private rootStoreService: RootStoreService) {}
  ngOnInit() {
    this.rootStoreService.dispatch(new AppStartAction());
  }
}
