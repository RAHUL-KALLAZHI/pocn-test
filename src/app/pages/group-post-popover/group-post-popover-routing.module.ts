import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPostPopoverPage } from './group-post-popover.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPostPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPostPopoverPageRoutingModule {}
