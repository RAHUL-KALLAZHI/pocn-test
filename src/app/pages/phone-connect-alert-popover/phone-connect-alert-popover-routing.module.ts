import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhoneConnectAlertPopoverPage } from './phone-connect-alert-popover.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneConnectAlertPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneConnectAlertPopoverPageRoutingModule {}
