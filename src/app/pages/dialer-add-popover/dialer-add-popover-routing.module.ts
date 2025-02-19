import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialerAddPopoverPage } from './dialer-add-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DialerAddPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialerAddPopoverPageRoutingModule {}
