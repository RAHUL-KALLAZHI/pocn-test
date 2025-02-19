import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MorePopoverPage } from './more-popover.page';

const routes: Routes = [
  {
    path: '',
    component: MorePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MorePopoverPageRoutingModule {}
