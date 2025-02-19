import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmailConnectAlertPopoverPage } from './email-connect-alert-popover.page';

const routes: Routes = [
  {
    path: '',
    component: EmailConnectAlertPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailConnectAlertPopoverPageRoutingModule {}
