import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialerEditPopoverPage } from './dialer-edit-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DialerEditPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialerEditPopoverPageRoutingModule {}
