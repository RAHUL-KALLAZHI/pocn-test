import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialerPopoverPage } from './dialer-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DialerPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialerPopoverPageRoutingModule {}
