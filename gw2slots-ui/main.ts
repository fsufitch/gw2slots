import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RootModule } from './app/root/root.module';

// depending on the env mode, enable prod mode or add debugging modules
if (['prod', 'deploy'].indexOf(process.env.ENV) > -1) {
  enableProdMode();
}

export function main() {
  require('style-loader!./app/global-styles.scss');
  return platformBrowserDynamic().bootstrapModule(RootModule);
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
