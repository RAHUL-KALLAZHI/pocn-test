import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientConnectSettingsPage } from './patient-connect-settings.page';

const routes: Routes = [
  {
    path: '',
    component: PatientConnectSettingsPage
  },
  {
    path: 'phone-connect-alert-popover',
    loadChildren: () => import('./../phone-connect-alert-popover/phone-connect-alert-popover.module').then( m => m.PhoneConnectAlertPopoverPageModule)
  },
  {
    path: 'email-connect-alert-popover',
    loadChildren: () => import('./../email-connect-alert-popover/email-connect-alert-popover.module').then( m => m.EmailConnectAlertPopoverPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientConnectSettingsPageRoutingModule {}
