import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupDetailsEditPage } from './group-details-edit.page';

const routes: Routes = [
  {
    path: '',
    component: GroupDetailsEditPage
  },
  {
    path: 'groups-admin-modal', 
    loadChildren: () => import('./../groups-admin-modal/groups-admin-modal.module').then( m => m.GroupsAdminModalPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupDetailsEditPageRoutingModule {}
