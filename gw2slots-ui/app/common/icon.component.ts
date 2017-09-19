import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

const octicons = require('octicons');

@Component({
  selector: 'icon',
  template: `<span [innerHTML]="getIconSVG()"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent  {
  @Input() name: string;

  constructor(private sanitizer: DomSanitizer) {}

  getIconSVG(): SafeHtml {
    if (!octicons[this.name]) {
      console.error(`Octicon "${this.name}" does not exist`);
      return '[error]';
    }
    let svg: string = octicons[this.name].toSVG();

    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
