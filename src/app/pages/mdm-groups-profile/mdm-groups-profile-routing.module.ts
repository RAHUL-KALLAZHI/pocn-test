import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdmGroupsProfilePage } from './mdm-groups-profile.page';

const routes: Routes = [
  {
    path: '',
    component: MdmGroupsProfilePage
  },
  {
    path: 'mdm-groups-profile',
    loadChildren: () => import('./../mdm-groups-profile/mdm-groups-profile.module').then( m => m.MdmGroupsProfilePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MdmGroupsProfilePageRoutingModule {}
