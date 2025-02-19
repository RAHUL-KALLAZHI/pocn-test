import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupDetailsViewPage } from './group-details-view.page';

const routes: Routes = [
  {
    path: '',
    component: GroupDetailsViewPage
  },
  {
    path: 'delete-group-confirm-popover',
    loadChildren: () => import('./../delete-group-confirm-popover/delete-group-confirm-popover.module').then( m => m.DeleteGroupConfirmPopoverPageModule)
  },
  {
    path: 'invite-group-page',
    loadChildren: () => import('./../invite-group-page/invite-group-page.module').then( m => m.InviteGroupPagePageModule)
  },
  {
    path: 'group-post-share-popover',
    loadChildren: () => import('./../group-post-share-popover/group-post-share-popover.module').then( m => m.GroupPostSharePopoverPageModule)
  },
  {
    path: 'mdm-groups-profile',
    loadChildren: () => import('./../mdm-groups-profile/mdm-groups-profile.module').then( m => m.MdmGroupsProfilePageModule)
  },
   {
    path: 'group-public-profile',
    loadChildren: () => import('./../group-public-profile/group-public-profile.module').then( m => m.GroupPublicProfilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupDetailsViewPageRoutingModule {}
