import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupsAdminModalPage } from './groups-admin-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GroupsAdminModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsAdminModalPageRoutingModule {}
