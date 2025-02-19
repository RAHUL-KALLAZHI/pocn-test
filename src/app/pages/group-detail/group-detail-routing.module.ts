import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupDetailPage } from './group-detail.page';

const routes: Routes = [
  {
    path: '',
    component: GroupDetailPage
  },
  {
    path: 'group-post-popover',
    loadChildren: () => import('./../group-post-popover/group-post-popover.module').then( m => m.GroupPostPopoverPageModule)
  },
  {
    path: 'quote-group-popover',
    loadChildren: () => import('./../quote-group-popover/quote-group-popover.module').then( m => m.QuoteGroupPopoverPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupDetailPageRoutingModule {}
