import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPostSharePopoverPage } from './group-post-share-popover.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPostSharePopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPostSharePopoverPageRoutingModule {}
