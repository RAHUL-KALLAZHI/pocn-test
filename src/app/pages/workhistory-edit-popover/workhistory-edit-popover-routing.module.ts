import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkhistoryEditPopoverPage } from './workhistory-edit-popover.page';

const routes: Routes = [
  {
    path: '',
    component: WorkhistoryEditPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkhistoryEditPopoverPageRoutingModule {}
