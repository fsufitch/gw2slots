import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'global-styles',
  template: '<!-- style placeholder -->',
  styles: [
    require('./global-styles.component.scss'),
  ],
  encapsulation: ViewEncapsulation.None,
})
export class GlobalStylesComponent {}
