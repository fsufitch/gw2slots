import { Routes } from '@angular/router';

import { RegistrationComponent } from './registration.component';
import { NotLoggedInGuard } from 'gw2slots-ui/app/auth/not-logged-in.guard';

export const ROUTES: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [NotLoggedInGuard],
  },
];
