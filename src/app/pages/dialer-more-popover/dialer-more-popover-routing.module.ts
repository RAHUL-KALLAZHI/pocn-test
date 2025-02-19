import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DialerMorePopoverPage } from './dialer-more-popover.page';

const routes: Routes = [
  {
    path: '',
    component: DialerMorePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DialerMorePopoverPageRoutingModule {}
