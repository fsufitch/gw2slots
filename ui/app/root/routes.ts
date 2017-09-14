import { Routes } from '@angular/router';

import { HomepageComponent } from './homepage';
import { FAQComponent } from './faq';

export const ROUTES: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'faq',
    component: FAQComponent,
  }
];
