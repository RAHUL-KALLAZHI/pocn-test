import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MdmProfilePage } from './mdm-profile.page';

const routes: Routes = [
  {
    path: '',
    component: MdmProfilePage
  },
  {
    path: 'mdm-profile-message',data: {preload: true, loadAfterSeconds: 5}, 
    loadChildren: () => import('./../mdm-profile-message/mdm-profile-message.module').then( m => m.MdmProfileMessagePageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MdmProfilePageRoutingModule {}
