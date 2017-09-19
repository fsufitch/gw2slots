import { Routes } from '@angular/router';

import { HomepageComponent } from './homepage';
import { FAQComponent } from './faq';
import { AboutComponent } from './about';

export const ROUTES: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'faq',
    component: FAQComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
